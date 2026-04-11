import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FoodModal from "./FoodModal";

describe("FoodModal", () => {
  it("não chama onSave com validação — campos vazios", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const onSave = vi.fn();

    render(<FoodModal isOpen onClose={() => {}} onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(alertSpy).toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("cadastro: envia dados válidos para onSave", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<FoodModal isOpen onClose={() => {}} onSave={onSave} />);

    await user.type(screen.getByPlaceholderText(/maçã/i), "Arroz integral");
    await user.selectOptions(screen.getByRole("combobox"), "Grains");
    await user.clear(screen.getByPlaceholderText(/0\.52/));
    await user.type(screen.getByPlaceholderText(/0\.52/), "1.25");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      name: "Arroz integral",
      category: "Grains",
      caloriesPerGram: 1.25,
    });
  });
});
