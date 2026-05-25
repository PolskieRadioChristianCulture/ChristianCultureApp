import { useState, useEffect } from 'react';

export function useCustomBackgrounds() {
  const [backgrounds, setBackgrounds] = useState<{name: string, url: string}[]>([]);
  const [isActive, setIsActive] = useState<boolean>(() => localStorage.getItem('cc_custom_bgs_active') === 'true');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleStorage = () => setIsActive(localStorage.getItem('cc_custom_bgs_active') === 'true');
    window.addEventListener('cc_custom_bgs_toggle', handleStorage);
    return () => window.removeEventListener('cc_custom_bgs_toggle', handleStorage);
  }, []);

  const toggleActive = (active: boolean) => {
    localStorage.setItem('cc_custom_bgs_active', active ? 'true' : 'false');
    setIsActive(active);
    window.dispatchEvent(new Event('cc_custom_bgs_toggle'));
  };

  useEffect(() => {
    let urls: {name: string, url: string}[] = [];
    const loadBackgrounds = async () => {
      try {
        if ('storage' in navigator && 'getDirectory' in navigator.storage) {
          const opfsRoot = await navigator.storage.getDirectory();
          const bgDir = await opfsRoot.getDirectoryHandle('cc_backgrounds', { create: true });
          
          for await (const [name, handle] of (bgDir as any).entries()) {
            if (handle.kind === 'file') {
              const file = await handle.getFile();
              const url = URL.createObjectURL(file);
              urls.push({ name, url });
            }
          }
          setBackgrounds(urls);
        }
      } catch (e) {
        console.warn('Could not load custom backgrounds', e);
      }
    };
    
    loadBackgrounds();
    
    const handleRefresh = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener('cc_custom_bgs_refresh', handleRefresh);
    
    return () => {
      window.removeEventListener('cc_custom_bgs_refresh', handleRefresh);
      urls.forEach(u => URL.revokeObjectURL(u.url));
    };
  }, [refreshTrigger]);

  const dispatchRefresh = () => window.dispatchEvent(new Event('cc_custom_bgs_refresh'));

  const addBackground = async (file: File) => {
    try {
      if ('storage' in navigator && 'getDirectory' in navigator.storage) {
        const opfsRoot = await navigator.storage.getDirectory();
        const bgDir = await opfsRoot.getDirectoryHandle('cc_backgrounds', { create: true });
        
        let count = 0;
        for await (const _ of (bgDir as any).entries()) {
          count++;
        }
        if (count >= 12) {
          throw new Error('MAX_LIMIT');
        }

        const fileHandle = await bgDir.getFileHandle(file.name, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(file);
        await writable.close();
        dispatchRefresh();
      }
    } catch (e) {
      throw e;
    }
  };

  const removeBackground = async (name: string) => {
    try {
      if ('storage' in navigator && 'getDirectory' in navigator.storage) {
        const opfsRoot = await navigator.storage.getDirectory();
        const bgDir = await opfsRoot.getDirectoryHandle('cc_backgrounds', { create: true });
        await bgDir.removeEntry(name);
        dispatchRefresh();
      }
    } catch (e) {
      console.warn('Failed to remove background', e);
    }
  };

  return { backgrounds, isActive, toggleActive, addBackground, removeBackground };
}
