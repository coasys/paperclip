import { Ad4mClient, PerspectiveProxy, Ad4mModel } from "@coasys/ad4m";

export interface Company {
  id: string;
  name: string;
  description?: string;
  status: "active" | "paused" | "archived";
  issuePrefix: string;
  budgetMonthlyCents: number;
  spentMonthlyCents: number;
  requireBoardApproval: boolean;
  brandColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Company Model using AD4M
 * 
 * In AD4M, a Company is represented as a Neighbourhood.
 * This model manages company metadata within the neighbourhood perspective.
 */
export class CompanyModel {
  private client: Ad4mClient;
  private model: Ad4mModel<Company> | null = null;

  constructor(client: Ad4mClient) {
    this.client = client;
  }

  /**
   * Initialize the model for a specific perspective (company)
   */
  async initialize(perspective: PerspectiveProxy): Promise<void> {
    // Define the Company subject class if not already defined
    await this.ensureSubjectClass(perspective);
    
    // Create the AD4M model
    this.model = new Ad4mModel<Company>({
      perspective,
      sourceType: "paperclip://Company",
    });
  }

  /**
   * Create a new company metadata entry
   */
  async create(data: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company> {
    if (!this.model) throw new Error("Model not initialized");
    
    const now = new Date();
    const company = await this.model.create({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    
    return company;
  }

  /**
   * Get company by ID
   */
  async get(id: string): Promise<Company | null> {
    if (!this.model) throw new Error("Model not initialized");
    return this.model.findById(id);
  }

  /**
   * Update company
   */
  async update(id: string, data: Partial<Omit<Company, "id" | "createdAt" | "updatedAt">>): Promise<Company> {
    if (!this.model) throw new Error("Model not initialized");
    
    const company = await this.model.findById(id);
    if (!company) throw new Error("Company not found");
    
    return this.model.update(id, {
      ...data,
      updatedAt: new Date(),
    });
  }

  /**
   * List all companies in the perspective
   */
  async list(): Promise<Company[]> {
    if (!this.model) throw new Error("Model not initialized");
    return this.model.findAll();
  }

  /**
   * Ensure the Company subject class is defined in AD4M
   */
  private async ensureSubjectClass(perspective: PerspectiveProxy): Promise<void> {
    // Check if subject class already exists
    const models = await perspective.getModels();
    const exists = models.some(m => m.name === "Company");
    
    if (exists) return;

    // Define the Company subject class
    await perspective.addModel({
      name: "Company",
      properties: [
        { name: "name", type: "string", required: true },
        { name: "description", type: "string" },
        { name: "status", type: "string", default: "active" },
        { name: "issuePrefix", type: "string", default: "PAP" },
        { name: "budgetMonthlyCents", type: "integer", default: 0 },
        { name: "spentMonthlyCents", type: "integer", default: 0 },
        { name: "requireBoardApproval", type: "boolean", default: true },
        { name: "brandColor", type: "string" },
        { name: "createdAt", type: "datetime" },
        { name: "updatedAt", type: "datetime" },
      ],
    });
  }
}
