// SVG图标加载器管理器
export interface ISvgLoader {
  (): Promise<Record<string, string>>;
}

class SvgLoaderManager {
  private static instance: SvgLoaderManager;
  private svgMap: Record<string, string> = {};
  private isLoading: boolean = false;
  private isInitialized: boolean = false;
  private loader: ISvgLoader | null = null;
  private initPromise: Promise<Record<string, string>> | null = null;
  private hasLoaderSet: boolean = false;

  private constructor() {}

  public static getInstance(): SvgLoaderManager {
    if (!SvgLoaderManager.instance) {
      SvgLoaderManager.instance = new SvgLoaderManager();
    }
    return SvgLoaderManager.instance;
  }

  /**
   * 设置SVG加载器
   * @param loader 加载器函数
   */
  public setLoader(loader: ISvgLoader): void {
    this.loader = loader;
    this.hasLoaderSet = true;
  }

  /**
   * 直接设置SVG映射数据
   * @param svgMap SVG映射数据
   */
  public setSvgMap(svgMap: Record<string, string>): void {
    this.svgMap = svgMap;
    this.isInitialized = true;
    this.hasLoaderSet = true;
  }

  /**
   * 初始化SVG映射关系
   */
  public async initialize(): Promise<Record<string, string>> {
    // 如果正在加载中，返回现有的Promise
    if (this.isLoading && this.initPromise) {
      return this.initPromise;
    }

    // 如果没有设置加载器，返回空对象
    if (!this.loader) {
      this.isInitialized = true;
      return this.svgMap;
    }

    // 重置状态，准备重新加载
    this.isLoading = true;
    this.isInitialized = false;
    
    this.initPromise = this.loader().then((svgMap) => {
      this.svgMap = svgMap;
      this.isInitialized = true;
      this.isLoading = false;
      return this.svgMap;
    }).catch((error) => {
      this.isLoading = false;
      console.warn('SVG加载失败:', error);
      return this.svgMap;
    });

    return this.initPromise;
  }

  /**
   * 获取SVG内容
   * @param key SVG图标名称
   * @returns SVG内容或null
   */
  public getSvg(key: string): string | null {
    return this.svgMap[key] || null;
  }

  /**
   * 检查是否已初始化
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * 重置状态（用于测试或重新加载）
   */
  public reset(): void {
    this.svgMap = {};
    this.isLoading = false;
    this.isInitialized = false;
    this.initPromise = null;
    this.hasLoaderSet = false;
  }
}

// 导出单例实例
export const svgLoaderManager = SvgLoaderManager.getInstance(); 