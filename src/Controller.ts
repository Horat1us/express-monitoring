import * as express from "express";
import { Control } from "./Control";
import * as helpers from "./helpers";
import * as controls from "./controls";

export interface ControllerConfig {
    controls: Array<{ id: string, control: Control }> | { [ k: string ]: Control } | Map<string, Control>;
}

export class Controller {
    public controls: Map<string, Control>;

    constructor(config: ControllerConfig) {
        this.controls = new Map<string, Control>();

        if (Array.isArray(config.controls)) {
            config.controls.forEach(
                ({ id, control }) => this.controls.set(id, control)
            );
        } else if (config.controls instanceof Map) {
            this.controls = config.controls;
        } else {
            Object.keys(config.controls).forEach(
                (id) => this.controls.set(id, (config.controls as { [ k: string ]: Control })[ id ])
            );
        }
    }

    public readonly control = async (req: express.Request, res: express.Response) => {
        if (!req.params.id) {
            return res.status(400).json({
                name: "Bad Request",
                message: "Missing required params: id.",
                code: 0,
                status: 400,
            });
        }

        const id: string = req.params.id;
        if (!this.controls.has(id)) {
            return res.status(404).json({
                name: "Not Found",
                message: `Control ${id} not found.`,
                code: -2,
            });
        }

        const control = this.controls.get(id) as Control;

        return this.execute(res, control);
    }

    public readonly full = async (req: express.Request, res: express.Response) => {
        const control = controls.Compose(this.controls);
        return this.execute(res, control);
    }

    private readonly execute = async (res: express.Response, control: Control) => {
        const response = await helpers.resolve(control);
        return res.status(200).json(response);
    }
}
