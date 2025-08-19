import React from 'react';
import { Link } from '@inertiajs/react';

interface LinkProps {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProjectsPagination {
    from: number;
    to: number;
    total: number;
    links: LinkProps[];
}

interface PaginationProps {
    data: ProjectsPagination;
}

export const Pagination: React.FC<PaginationProps> = ({ data }) => {
    return (
        <div className="xs:flex-col mt-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Showing <strong>{data.from}</strong> to <strong>{data.to}</strong> of <strong>{data.total}</strong> entries
            </p>

            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 flex flex-wrap items-center gap-2 overflow-x-auto">
                {data.links.map((link: LinkProps, index: number) => (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        preserveScroll
                        preserveState
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`min-w-[40px] rounded border px-3 py-1.5 text-center text-sm whitespace-nowrap transition-colors duration-200 ${
                            link.active
                                ? 'bg-blue-600 text-white dark:bg-blue-400 dark:text-black'
                                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};
