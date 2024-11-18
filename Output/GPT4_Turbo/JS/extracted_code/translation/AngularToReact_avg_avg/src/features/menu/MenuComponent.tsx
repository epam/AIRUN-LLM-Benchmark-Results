import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addMenu, selectMenu } from './menuSlice';

const MenuComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const menus = useAppSelector((state) => state.menu.menus);

  const handleAddMenu = () => {
    dispatch(addMenu({ title: 'New Menu' }));
  };

  return (
    <div>
      <button onClick={handleAddMenu}>Add Menu</button>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => dispatch(selectMenu({ menuId: menu.id }))}>
          {menu.title}
        </div>
      ))}
    </div>
  );
};

export default MenuComponent;