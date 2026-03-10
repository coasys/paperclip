import { Ad4mClient, PerspectiveProxy, Ad4mModel } from "@coasys/ad4m";

export interface Agent {
  id: string;
  name: string;
  role: string;
  title?: string;
  icon?: string;
  status: "idle" | "active" | "paused" | "error" | "terminated";
  capabilities?: string;
  adapterType: "process" | "http" | "openclaw";
  adapterConfig: Record<string, unknown>;
  runtimeConfig: Record<string, unknown>;
  budgetMonthlyCents: number;
  spentMonthlyCents: number;
  permissions: Record<string, unknown>;
  lastHeartbeatAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships (stored as links)
  reportsTo?: string; // Agent ID
  companyId: string; // Company/Neighbourhood ID
}

/**
 * Agent Model using AD4M
 * 
 * Agents are AI workers in a Paperclip company.
 * The org chart is represented via `reportsTo` links.
 */
export class AgentModel {
  private client: Ad4mClient;
  private model: Ad4mModel<Agent> | null = null;

  constructor(client: Ad4mClient) {
    this.client = client;
  }

  async initialize(perspective: PerspectiveProxy): Promise<void> {
    await this.ensureSubjectClass(perspective);
    
    this.model = new Ad4mModel<Agent>({
      perspective,
      sourceType: "paperclip://Agent",
    });
  }

  async create(data: Omit<Agent, "id" | "createdAt" | "updatedAt">): Promise<Agent> {
    if (!this.model) throw new Error("Model not initialized");
    
    const now = new Date();
    const agent = await this.model.create({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    
    // If reportsTo is set, create the org chart link
    if (data.reportsTo) {
      await this.setReportsTo(agent.id, data.reportsTo);
    }
    
    return agent;
  }

  async get(id: string): Promise<Agent | null> {
    if (!this.model) throw new Error("Model not initialized");
    return this.model.findById(id);
  }

  async update(id: string, data: Partial<Omit<Agent, "id" | "createdAt" | "updatedAt">>): Promise<Agent> {
    if (!this.model) throw new Error("Model not initialized");
    
    // Handle reportsTo link update
    if (data.reportsTo !== undefined) {
      await this.setReportsTo(id, data.reportsTo);
    }
    
    return this.model.update(id, {
      ...data,
      updatedAt: new Date(),
    });
  }

  async list(): Promise<Agent[]> {
    if (!this.model) throw new Error("Model not initialized");
    return this.model.findAll();
  }

  /**
   * Get all agents reporting to a specific manager
   */
  async getReports(managerId: string): Promise<Agent[]> {
    if (!this.model) throw new Error("Model not initialized");
    
    // Query via Prolog for agents with reportsTo link to managerId
    const perspective = this.model.perspective;
    const result = await perspective.infer(`
      findall(Agent, (
        link(Agent, "paperclip://reportsTo", "${managerId}")
      ), Agents)
    `);
    
    const agentIds = result[0]?.Agents || [];
    const agents = await Promise.all(
      agentIds.map((id: string) => this.get(id))
    );
    
    return agents.filter((a): a is Agent => a !== null);
  }

  /**
   * Get the org chart (tree structure)
   */
  async getOrgChart(rootId?: string): Promise<OrgChartNode> {
    const root = rootId ? await this.get(rootId) : await this.getCEO();
    if (!root) throw new Error("Root agent not found");
    
    const reports = await this.getReports(root.id);
    const children = await Promise.all(
      reports.map(r => this.getOrgChart(r.id))
    );
    
    return {
      agent: root,
      children,
    };
  }

  private async getCEO(): Promise<Agent | null> {
    // Find agent with no reportsTo link (root of org chart)
    const agents = await this.list();
    return agents.find(a => !a.reportsTo) || null;
  }

  private async setReportsTo(agentId: string, managerId: string | null): Promise<void> {
    if (!this.model) throw new Error("Model not initialized");
    
    const perspective = this.model.perspective;
    
    // Remove existing reportsTo links
    await perspective.removeLinks({
      source: agentId,
      predicate: "paperclip://reportsTo",
    });
    
    // Add new link if managerId is provided
    if (managerId) {
      await perspective.addLink({
        source: agentId,
        predicate: "paperclip://reportsTo",
        target: managerId,
      });
    }
  }

  private async ensureSubjectClass(perspective: PerspectiveProxy): Promise<void> {
    const models = await perspective.getModels();
    const exists = models.some(m => m.name === "Agent");
    
    if (exists) return;

    await perspective.addModel({
      name: "Agent",
      properties: [
        { name: "name", type: "string", required: true },
        { name: "role", type: "string", default: "general" },
        { name: "title", type: "string" },
        { name: "icon", type: "string" },
        { name: "status", type: "string", default: "idle" },
        { name: "capabilities", type: "string" },
        { name: "adapterType", type: "string", default: "process" },
        { name: "adapterConfig", type: "string" }, // JSON
        { name: "runtimeConfig", type: "string" }, // JSON
        { name: "budgetMonthlyCents", type: "integer", default: 0 },
        { name: "spentMonthlyCents", type: "integer", default: 0 },
        { name: "permissions", type: "string" }, // JSON
        { name: "lastHeartbeatAt", type: "datetime" },
        { name: "metadata", type: "string" }, // JSON
        { name: "createdAt", type: "datetime" },
        { name: "updatedAt", type: "datetime" },
      ],
    });
  }
}

interface OrgChartNode {
  agent: Agent;
  children: OrgChartNode[];
}
