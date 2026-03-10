import { Ad4mClient, PerspectiveProxy } from "@coasys/ad4m";
import { CompanyModel } from "./models/Company.js";
import { AgentModel } from "./models/Agent.js";
import { GoalModel } from "./models/Goal.js";
import { ProjectModel } from "./models/Project.js";
import { IssueModel } from "./models/Issue.js";

export interface Ad4mClientConfig {
  /** AD4M executor GraphQL URL */
  executorUrl: string;
  /** Admin credential or JWT token */
  token: string;
}

/**
 * AD4M Client for Paperclip
 * 
 * Replaces PostgreSQL with AD4M distributed storage.
 * Each Company becomes an AD4M Neighbourhood.
 */
export class PaperclipAd4mClient {
  private client: Ad4mClient;
  private perspective: PerspectiveProxy | null = null;
  
  // Model accessors
  public companies: CompanyModel;
  public agents: AgentModel;
  public goals: GoalModel;
  public projects: ProjectModel;
  public issues: IssueModel;

  constructor(config: Ad4mClientConfig) {
    this.client = new Ad4mClient(config.executorUrl, config.token);
    
    // Initialize models
    this.companies = new CompanyModel(this.client);
    this.agents = new AgentModel(this.client);
    this.goals = new GoalModel(this.client);
    this.projects = new ProjectModel(this.client);
    this.issues = new IssueModel(this.client);
  }

  /**
   * Initialize the client and ensure subject classes are registered
   */
  async initialize(): Promise<void> {
    // Ensure we're connected
    await this.client.agent.status();
    
    // Register subject classes
    await this.registerSubjectClasses();
  }

  /**
   * Join a Paperclip company as an AD4M neighbourhood
   */
  async joinCompany(neighbourhoodUrl: string): Promise<string> {
    const perspectiveUuid = await this.client.neighbourhood.joinFromUrl(neighbourhoodUrl);
    this.perspective = await this.client.perspective.byUuid(perspectiveUuid);
    return perspectiveUuid;
  }

  /**
   * Create a new Paperclip company as an AD4M neighbourhood
   */
  async createCompany(name: string, description?: string): Promise<string> {
    // Create a new perspective
    const perspective = await this.client.perspective.add(name);
    
    // Publish as neighbourhood
    const neighbourhoodUrl = await this.client.neighbourhood.publishFromPerspective(
      perspective.uuid,
      {
        name,
        description: description || "",
      }
    );
    
    this.perspective = perspective;
    return neighbourhoodUrl;
  }

  /**
   * Register all Paperclip subject classes with AD4M
   */
  private async registerSubjectClasses(): Promise<void> {
    // Subject classes will be registered via add_model calls
    // This is done lazily when first accessed
  }

  /**
   * Get the current perspective (company context)
   */
  getPerspective(): PerspectiveProxy | null {
    return this.perspective;
  }

  /**
   * Set the current perspective (switch company context)
   */
  async setPerspective(perspectiveUuid: string): Promise<void> {
    this.perspective = await this.client.perspective.byUuid(perspectiveUuid);
  }
}

export * from "./models/Company.js";
export * from "./models/Agent.js";
export * from "./models/Goal.js";
export * from "./models/Project.js";
export * from "./models/Issue.js";
