import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FoodModal from "./FoodModal";

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText(/apple/i), "Arroz integral");
  await user.selectOptions(screen.getAllByRole("combobox")[0], "Grains");

  const numberInputs = screen.getAllByRole("spinbutton");
  const values = [130, 2.5, 28, 0.5, 1.2, 0.3, 5];
  for (let i = 0; i < values.length; i++) {
    await user.clear(numberInputs[i]);
    await user.type(numberInputs[i], String(values[i]));
  }
}

describe("FoodModal", () => {
  it("não chama onSave com validação — campos vazios", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const onSave = vi.fn();

    render(<FoodModal isOpen onClose={() => {}} onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(alertSpy).toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("cadastro: envia dados válidos para onSave", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<FoodModal isOpen onClose={() => {}} onSave={onSave} />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      name: "Arroz integral",
      category: "Grains",
      kcalPer100g: 130,
      proteinPer100g: 2.5,
      carbohydratesPer100g: 28,
      fatPer100g: 0.5,
      fiberPer100g: 1.2,
      sugarPer100g: 0.3,
      sodiumPer100g: 5,
    });
  });
});
