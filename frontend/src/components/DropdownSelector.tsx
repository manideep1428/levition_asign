import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';

const MultiSelectDropdown = ({ options, selectedOptions, setSelectedOptions }) => {
  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center border border-gray-300 px-3 py-2 rounded-md shadow-sm hover:bg-gray-50">
        <span className="mr-2">
          {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select options'}
        </span>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white shadow-md rounded-md">
        {options.map((option) => (
          <DropdownMenuItem key={option} className="cursor-pointer" onClick={() => toggleOption(option)}>
            <div className="flex items-center">
              {selectedOptions.includes(option) && <Check className="w-4 h-4 text-green-500 mr-2" />}
              {option}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelectDropdown;
