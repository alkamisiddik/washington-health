import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';

interface Option {
    value: string;
    label: string;
}

interface AutocompleteProps {
    options: Option[];
    value?: string;
    onValueChange?: (value: string) => void;
    onCreateOption?: (label: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    className?: string;
}

export function Autocomplete({
                                 options,
                                 value,
                                 onValueChange,
                                 onCreateOption,
                                 placeholder = 'Select option...',
                                 searchPlaceholder = 'Search...',
                                 disabled = false,
                                 className
                             }: AutocompleteProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const selectedOption = options.find((option) => option.value === value);

    const filteredOptions = options
        .filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (a.value === value) return -1; // move selected option to top
            if (b.value === value) return 1;
            return a.label.localeCompare(b.label); // optional: alphabetical order
        });

    const showCreateButton =
        searchQuery &&
        !options.some((option) => option.label.toLowerCase() === searchQuery.toLowerCase());

    return (
        <Popover open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (newOpen) setSearchQuery('');
        }}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full justify-between', className)}
                    disabled={disabled}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        className="h-9"
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        {filteredOptions.length > 0 ? (
                            <CommandGroup className="max-h-[200px] overflow-auto">
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                            onValueChange?.(option.value);
                                            setOpen(false);
                                        }}
                                    >
                                        {option.label}
                                        <Check
                                            className={cn(
                                                'ml-auto h-4 w-4',
                                                value === option.value ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : (
                            <CommandEmpty>
                                <div className="p-2 text-sm text-gray-500">
                                    No option found.
                                    {showCreateButton && (
                                        <button
                                            onClick={() => {
                                                onCreateOption?.(searchQuery);
                                                setSearchQuery('');
                                                setOpen(false);
                                            }}
                                            className="ml-2 mt-2 text-blue-600 hover:underline block"
                                        >
                                            + Add "{searchQuery}"
                                        </button>
                                    )}
                                </div>
                            </CommandEmpty>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
