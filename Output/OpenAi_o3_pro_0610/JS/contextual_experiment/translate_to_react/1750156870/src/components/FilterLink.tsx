import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setFilter, selectFilter, Filter } from '../slices/todosSlice';

interface Props {
    filter: Filter;
    children: React.ReactNode;
}

const FilterLink: React.FC<Props> = ({ filter, children }) => {
    const dispatch = useAppDispatch();
    const currentFilter = useAppSelector(selectFilter);

    const selected = currentFilter === filter;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!selected) {
            dispatch(setFilter(filter));
        }
    };

    const href =
        filter === 'all'
            ? '#/'
            : filter === 'active'
            ? '#/active'
            : '#/completed';

    return (
        <li>
            <a className={selected ? 'selected' : undefined} href={href} onClick={handleClick}>
                {children}
            </a>
        </li>
    );
};

export default FilterLink;
