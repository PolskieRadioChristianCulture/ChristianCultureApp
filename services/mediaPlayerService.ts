import { EventEmitter } from 'eventemitter3';

export interface Material {
  id: string;
  name: string;
  type: string;
  size: number;
  addedAt: string;
  useAsContext?: boolean;
  folder?: string;
}

class MediaPlayerService extends EventEmitter {
  public playingMaterial: Material | null = null;
  public playingUrl: string | null = null;
  public playlist: Material[] = [];
  public isMinimized: boolean = false;

  async getFile(material: Material): Promise<File | null> {
    try {
      if ('storage' in navigator && 'getDirectory' in navigator.storage) {
        const opfsRoot = await navigator.storage.getDirectory();
        const materialsDir = await opfsRoot.getDirectoryHandle('cc_materials', { create: false });
        
        let fileHandle;
        if (material.name.includes('/')) {
          const parts = material.name.split('/');
          const folderName = parts[0];
          const fileName = parts[1];
          const folderHandle = await materialsDir.getDirectoryHandle(folderName, { create: false });
          fileHandle = await folderHandle.getFileHandle(fileName);
        } else {
          fileHandle = await materialsDir.getFileHandle(material.name);
        }
        
        return await fileHandle.getFile();
      }
    } catch (e) {
      console.error("Could not get file:", e);
    }
    return null;
  }

  async play(material: Material, fullList: Material[]) {
    if (this.playingUrl && this.playingUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.playingUrl);
    }

    try {
      if ('storage' in navigator && 'getDirectory' in navigator.storage) {
        const opfsRoot = await navigator.storage.getDirectory();
        const materialsDir = await opfsRoot.getDirectoryHandle('cc_materials', { create: false });
        const fileHandle = await materialsDir.getFileHandle(material.name);
        const file = await fileHandle.getFile();
        const url = URL.createObjectURL(file);
        
        this.playingMaterial = material;
        this.playingUrl = url;
        this.isMinimized = false;
        localStorage.setItem("cc_widget_mediaplayer_visible", "true");
        window.dispatchEvent(new Event("cc_widgets_updated"));
        
        // Filter out non-playable things of the same group?
        const groupType = material.type.split('/')[0];
        
        this.playlist = fullList.filter(m => m.type.startsWith(groupType));

        this.emit('changed');
      }
    } catch (e) {
      console.error("Could not play file:", e);
      this.stop();
    }
  }

  playUrl(url: string, name: string) {
    if (this.playingUrl && this.playingUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.playingUrl);
    }
    
    this.playingMaterial = {
      id: 'external-' + Date.now(),
      name,
      type: 'audio/mpeg',
      size: 0,
      addedAt: new Date().toISOString()
    };
    this.playingUrl = url;
    this.playlist = [this.playingMaterial];
    this.isMinimized = false;
    localStorage.setItem("cc_widget_mediaplayer_visible", "true");
    window.dispatchEvent(new Event("cc_widgets_updated"));
    this.emit('changed');
  }

  playNext() {
    if (!this.playingMaterial || this.playlist.length <= 1) {
      this.stop();
      return;
    }
    const idx = this.playlist.findIndex(m => m.id === this.playingMaterial?.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % this.playlist.length;
      this.play(this.playlist[nextIdx], this.playlist);
    } else {
      this.stop();
    }
  }

  playPrev() {
    if (!this.playingMaterial || this.playlist.length <= 1) {
      this.stop();
      return;
    }
    const idx = this.playlist.findIndex(m => m.id === this.playingMaterial?.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + this.playlist.length) % this.playlist.length;
      this.play(this.playlist[prevIdx], this.playlist);
    }
  }

  stop() {
    if (this.playingUrl) {
      URL.revokeObjectURL(this.playingUrl);
    }
    this.playingMaterial = null;
    this.playingUrl = null;
    this.playlist = [];
    this.isMinimized = false;
    this.emit('changed');
  }

  setMinimized(val: boolean) {
    this.isMinimized = val;
    this.emit('changed');
  }

  openMyFiles() {
    this.emit('openModal');
  }
}

export const mediaPlayerService = new MediaPlayerService();

