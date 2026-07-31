'use client';

import { KeyboardEvent, useId, useMemo, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SearchOption = {
    value: string;
    label: string;
    detail?: string;
};

const EMPTY_DISABLED_VALUES: string[] = [];

type SearchSelectProps = {
    id: string;
    label: string;
    value: string;
    options: SearchOption[];
    onChange: (value: string) => void;
    placeholder: string;
    disabledValues?: string[];
    optional?: boolean;
};

export default function SearchSelect({
    id,
    label,
    value,
    options,
    onChange,
    placeholder,
    disabledValues = EMPTY_DISABLED_VALUES,
    optional = false,
}: SearchSelectProps) {
    const listId = `${useId()}-listbox`;
    const [query, setQuery] = useState(value);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const disabled = useMemo(() => new Set(disabledValues), [disabledValues]);

    const filteredOptions = useMemo(() => {
        const normalized = query.trim().toLocaleLowerCase('zh-TW');
        return options
            .filter((option) => !disabled.has(option.value) || option.value === value)
            .filter((option) =>
                !normalized || option.label.toLocaleLowerCase('zh-TW').includes(normalized),
            )
            .slice(0, 40);
    }, [disabled, options, query, value]);

    const selectOption = (option: SearchOption) => {
        onChange(option.value);
        setQuery(option.label);
        setOpen(false);
        setActiveIndex(0);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => Math.min(index + 1, filteredOptions.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
        } else if (event.key === 'Enter' && open && filteredOptions[activeIndex]) {
            event.preventDefault();
            selectOption(filteredOptions[activeIndex]);
        } else if (event.key === 'Escape') {
            setOpen(false);
            setQuery(value);
        }
    };

    return (
        <div className='relative'>
            <label htmlFor={id} className='mb-1.5 flex items-center gap-2 text-xs text-foreground-muted'>
                {label}
                {optional && <span className='text-[10px] text-foreground-muted/60'>選填</span>}
            </label>
            <div className='group relative'>
                <Search
                    size={14}
                    className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-accent-gold'
                    aria-hidden='true'
                />
                <input
                    id={id}
                    role='combobox'
                    aria-expanded={open}
                    aria-controls={listId}
                    aria-autocomplete='list'
                    aria-required={!optional}
                    value={open ? query : value}
                    onFocus={() => {
                        setQuery(value);
                        setOpen(true);
                    }}
                    onBlur={() => {
                        window.setTimeout(() => {
                            setOpen(false);
                            setQuery(value);
                        }, 120);
                    }}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                        setActiveIndex(0);
                        if (value) onChange('');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className='w-full rounded-lg border border-white/10 bg-black/20 py-2.5 pl-9 pr-9 text-sm outline-none transition placeholder:text-foreground-muted/45 focus:border-accent-gold/55 focus:ring-2 focus:ring-accent-gold/10'
                />
                {value ? (
                    <button
                        type='button'
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                            onChange('');
                            setQuery('');
                            setOpen(true);
                        }}
                        className='absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-foreground-muted hover:bg-white/5 hover:text-foreground'
                        aria-label={`清除${label}`}
                    >
                        <X size={14} />
                    </button>
                ) : (
                    <ChevronDown
                        size={14}
                        className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted'
                        aria-hidden='true'
                    />
                )}
            </div>

            {open && (
                <div
                    id={listId}
                    role='listbox'
                    className='absolute z-30 mt-1.5 max-h-56 w-full overflow-y-auto rounded-lg border border-white/10 bg-[#171717] p-1.5 shadow-2xl shadow-black/60 custom-scrollbar'
                >
                    {filteredOptions.length === 0 ? (
                        <p className='px-3 py-4 text-center text-xs text-foreground-muted'>找不到符合項目</p>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <button
                                key={option.value}
                                type='button'
                                role='option'
                                aria-selected={option.value === value}
                                onMouseDown={(event) => event.preventDefault()}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => selectOption(option)}
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition',
                                    index === activeIndex && 'bg-white/7',
                                    option.value === value && 'text-accent-gold',
                                )}
                            >
                                <span className='min-w-0 flex-1 truncate'>{option.label}</span>
                                {option.detail && <span className='text-[10px] text-foreground-muted'>{option.detail}</span>}
                                {option.value === value && <Check size={14} className='shrink-0' />}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
