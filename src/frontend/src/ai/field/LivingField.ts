import { type FieldMode, LivingFieldEngine } from "./fieldEngine";

export type { FieldMode };

let engineInstance: LivingFieldEngine | null = null;

export function mountLivingField(canvas: HTMLCanvasElement): LivingFieldEngine {
  if (engineInstance) {
    engineInstance.stop();
  }
  const engine = new LivingFieldEngine(canvas);
  const rect = canvas.parentElement?.getBoundingClientRect();
  if (rect) {
    engine.resize(rect.width, rect.height);
  }
  engine.start();
  engineInstance = engine;
  return engine;
}

export function unmountLivingField() {
  if (engineInstance) {
    engineInstance.stop();
    engineInstance = null;
  }
}
