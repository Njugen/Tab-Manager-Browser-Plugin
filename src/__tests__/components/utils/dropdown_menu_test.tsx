import { render, screen, within, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import randomNumber from "../../../tools/random_number";
import DropdownMenu from "../../../components/utils/dropdown_menu/dropdown_menu";
import { iFieldOption } from "../../../interfaces/dropdown";
import iDropdownMenu from "../../../interfaces/dropdown_menu";

const mockPreset: iFieldOption = {
    id: randomNumber(),
    label: randomNumber().toString()
}

const mockOptions: Array<iFieldOption> = [];
const mockCallback = jest.fn((e: any) => e);
const mockTag = randomNumber().toString()

for(let i = 0; i < 5; i++){
    mockOptions.push(
        {
            id: randomNumber(),
            label: randomNumber().toString()
        }
    )
}

const props: iDropdownMenu = {
    options: mockOptions,
    tag: mockTag,
    onSelect: mockCallback,
    selected: null
}

describe("Test <DropdownMenu>", () => {
    test("Renders ok, each option props trigger 'onSelect' callback when clicked", () => {
        render(<DropdownMenu { ...props } selected={null} />);

        const menu = screen.getByRole("list");
        
        mockOptions.forEach((option) => {
            const item = within(menu).getByText(option.label, { selector: "button" });
            fireEvent.click(item);

            expect(mockCallback).toHaveBeenCalledWith(option.id);
        })
    })

    test("Renders and works ok with preset 'selected' prop", () => {
        render(<DropdownMenu { ...props } selected={mockOptions[0].id} />);

        const menu = screen.getByRole("list");
        
        mockOptions.forEach((option) => {
            const item = within(menu).getByText(option.label, { selector: "button" });
            fireEvent.click(item);

            expect(mockCallback).toHaveBeenCalledWith(option.id);
        })
    })
});