/**
 * Google Cast Service for Christian Culture Global ecosystem.
 * Optimized for Radio Streaming with Forced Start logic.
 * v4.5.342
 */

declare const cast: any;
declare const chrome: any;

export interface CastSessionState {
  isConnected: boolean;
  isMediaLoaded: boolean;
}

export class CastService {
  private static instance: CastService;
  private castContext: any = null;

  private constructor() {
    this.initialize();
  }

  private initialize() {
    const castObj = (window as any).cast;
    if (castObj && castObj.framework) {
      try {
        this.castContext = castObj.framework.CastContext.getInstance();
        console.log("CAST: Context initialized.");
      } catch (e) {
        console.error("CAST: Error getting CastContext", e);
      }
    }
  }

  public isAvailable(): boolean {
    if (!this.castContext) {
      this.initialize();
    }
    return !!this.castContext;
  }

  public getCastState(): string {
    if (!this.castContext) return 'UNAVAILABLE';
    const castObj = (window as any).cast;
    return this.castContext.getCastState();
  }

  public static getInstance(): CastService {
    if (!CastService.instance) {
      CastService.instance = new CastService();
    }
    return CastService.instance;
  }

  public setupListeners(onStateChange: (state: CastSessionState) => void) {
    if (!this.castContext) return () => {};

    const castObj = (window as any).cast;
    if (!castObj || !castObj.framework) return () => {};

    const handleSessionEvent = () => {
      const session = this.castContext.getCurrentSession();
      onStateChange({
        isConnected: !!session,
        isMediaLoaded: session ? session.getMediaSession() != null : false
      });
    };

    const eventNames = [
      castObj.framework.CastContextEventType.SESSION_STARTING,
      castObj.framework.CastContextEventType.SESSION_STARTED,
      castObj.framework.CastContextEventType.SESSION_RESUMED,
      castObj.framework.CastContextEventType.SESSION_ENDED,
      castObj.framework.CastContextEventType.SESSION_START_FAILED
    ];

    eventNames.forEach(evt => this.castContext.addEventListener(evt, handleSessionEvent));

    return () => {
      eventNames.forEach(evt => this.castContext.removeEventListener(evt, handleSessionEvent));
    };
  }

  /**
   * Loads radio stream to the Cast device.
   * FORCED START VERSION 3.0 - Maximum Reliability
   */
  public async loadMedia(url: string, title: string, subtitle: string = "Christian Culture Global") {
    let session = this.castContext?.getCurrentSession();
    if (!session) {
      console.log("CAST: No active session. Requesting one...");
      try {
        await this.castContext?.requestSession();
        session = this.castContext?.getCurrentSession();
      } catch (err) {
        console.error("CAST: Session request failed", err);
        throw err;
      }
    }

    if (!session) {
      console.error("CAST: No active session after request.");
      throw new Error("No active session");
    }

    const chromeObj = (window as any).chrome;
    if (!chromeObj || !chromeObj.cast) return;

    const mediaInfo = new chromeObj.cast.media.MediaInfo(url, 'audio/mpeg');
    mediaInfo.streamType = chromeObj.cast.media.StreamType.LIVE;
    mediaInfo.contentId = url;
    
    // Generic Media Metadata is the safest choice for Audio+Video receivers
    const metadata = new chromeObj.cast.media.GenericMediaMetadata();
    metadata.metadataType = chromeObj.cast.media.MetadataType.GENERIC;
    metadata.title = title;
    metadata.subtitle = subtitle;
    metadata.images = [
      new chromeObj.cast.Image('/backgrounds/3.jpg')
    ];
    
    mediaInfo.metadata = metadata;

    const request = new chromeObj.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;

    try {
      await session.load(request);
      console.log('CAST: Media loaded successfully.');
    } catch (error) {
      console.error('CAST: Error loading media', error);
    }
  }

  public stopMedia() {
    const session = this.castContext?.getCurrentSession();
    if (session) {
      session.stop();
      console.log('CAST: Media stopped.');
    }
  }
}