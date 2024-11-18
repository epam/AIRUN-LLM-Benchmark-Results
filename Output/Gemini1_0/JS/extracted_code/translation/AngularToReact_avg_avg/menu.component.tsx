import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMenusQuery, useUpdateMenuMutation } from '../rest';
import { setMenu } from '../menu';
import { nanoid } from 'nanoid';

const MenuComponent = () => {
  const dispatch = useDispatch();
  const { data: menus, isLoading } = useGetMenusQuery();
  const [updateMenu] = useUpdateMenuMutation();
  const [menu, setMenuState] = useState({
    panel: 'manage',
    editLink: true,
    editLinkText: '',
    editLinkURL: '',
    selectedLink: null,
    confirm: false,
  });

  const selectMenu = (menu: any) => {
    dispatch(setMenu(menu));
    setMenuState({ ...menuState, panel: 'edit' });
  };

  const remove = (scope: any) => {
    if (menu.list.length > 1) {
      const index = scope.$index;
      if (index > -1) {
        scope.sortableModelValue.splice(index, 1)[0];
      }
    } else {
      alert('Menu must have at least one link.');
    }
  };

  const newSubItem = (scope: any) => {
    const nodeData = scope.$modelValue;
    nodeData.items.push({
      id: nodeData.id * 10 + nodeData.items.length,
      title: nodeData.title + '.' + (nodeData.items.length + 1),
      url: '',
      items: [],
    });
  };

  const updateLink = () => {
    menu.list.forEach((link: any) => {
      if (angular.equals(link, menu.selectedLink)) {
        link.title = menu.editLinkText;
        link.url = menu.editLinkURL;
      }
      link.items.forEach((link2: any) => {
        if (angular.equals(link2, menu.selectedLink)) {
          link2.title = menu.editLinkText;
          link2.url = menu.editLinkURL;
        }
        link2.items.forEach((link3: any) => {
          if (angular.equals(link3, menu.selectedLink)) {
            link3.title = menu.editLinkText;
            link3.url = menu.editLinkURL;
          }
        });
      });
    });
  };

  const saveMenu = () => {
    updateMenu({
      menuID: menu.id,
      name: menu.name,
      menu: JSON.stringify(menu.list),
      area: menu.area,
    }).then(() => {
      alert('Menu saved successfully.');
    });
  };

  const deleteMenu = () => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      updateMenu({ menuID: menu.id }).then(() => {
        dispatch(setMenu(initialState));
        alert('Menu deleted successfully.');
      });
    }
  };

  const newMenu = () => {
    updateMenu({ name: menu.newName }).then((res) => {
      if (menus) {
        menus.push({ id: res.data, name: menu.newName });
      } else {
        menus.length = 0;
        menus.push({ id: res.data, name: menu.newName });
      }
      menu.newName = '';
      alert('Menu created successfully.');
    });
  };

  const updateMenuName = () => {
    updateMenu({
      menuID: menu.id,
      name: menu.name,
      menu: menu.menu,
      area: menu.area,
    }).then(() => {
      alert('Menu name updated successfully.');
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div ng-show="menu.panel==='manage'">
        <div class="bar-top">
          <a ng-click="admin.sidebar='core/html/sidebar.html';active=''"><i class="fa fa-angle-left"></i></a>
          <h1 translate="menus"></h1>
          <a class="sidebar-close" ng-click="admin.showAdminPanel=false;admin.active=false;"><i class="fa fa-times"></i></a>
        </div>
        <div class="bar--actions">
          <button ng-click="createMenu=!createMenu">
            <span translate="menu_new" ng-if="!createMenu"></span>
            <span translate="close" ng-if="createMenu"></span>
          </button>
        </div>
        <div class="form-case" ng-show="createMenu">
          <label for="name" translate="menu_add"></label>
          <input value="name" type='text' ng-model='menu.newName' placeholder="Menu Name e.g., Footer" />
          <button ng-click='newMenu()' translate="add"></button>
        </div>
        <ul>
          {menus &&
            menus.map((menu: any) => (
              <li key={nanoid()} ng-click="selectMenu(menu)">
                <a>{menu.name || 'N/A'}</a>
              </li>
            ))}
        </ul>
      </div>
      <div ng-show="menu.panel==='edit'">
        <div class="bar-top">
          <a ng-click="menu.panel='manage';menu.confirm=false"><i class="fa fa-angle-left"></i></a>
          <h1><span translate>editing</span>: {menu.name}</h1>
          <a class="sidebar-close" ng-click="admin.showAdminPanel=false;admin.active=false;"><i class="fa fa-times"></i></a>
        </div>
        <div class="bar--actions">
          <button ng-click="menu.confirm=true" translate="menu_delete"></button>
          <button ng-click="saveMenu()" translate="menu_save"></button>
        </div>
        <div class="form-case">
          <div class="half-width">
            <label for="name" translate>Name</label>
            <input value="name" type="text" ng-model="menu.name" onChange={updateMenuName} />
          </div>
          <div class="half-width">
            <label for="area" translate>Area</label>
            <div class="cos-select">
              <select value="area" ng-model="menu.area">
                <option value="primary" translate="primary"></option>
                <option value="secondary" translate="secondary"></option>
                <option value="footer" translate="footer"></option>
              </select>
            </div>
          </div>
          <div class="nestedSortable-list">
            <div ui-tree>
              <ol ui-tree-nodes="options" ng-model="list">
                {menu.list &&
                  menu.list.map((item: any) => (
                    <li key={nanoid()} class="nestedSortable-handle" ui-tree-node>
                      <div ui-tree-handle>
                        <p>{item.title}</p>
                        <div class="menu-manager">
                          <a data-nodrag ng-click="menu.editLink=true;menu.currentlyEditingLink=item;menu.editLinkText=item.title;menu.editLinkURL=item.url">
                            Edit
                          </a>
                          <a data-nodrag ng-click="newSubItem(this)">Add</a>
                          <a data-nodrag ng-click="remove(this)">Remove</a>
                        </div>
                      </div>
                      <ol ui-tree-nodes="options" ng-model="item.items">
                        {item.items &&
                          item.items.map((subItem: any) => (
                            <li key={nanoid()} ng-repeat="subItem in item.items" ui-tree-node>
                              <div ui-tree-handle>
                                {subItem.title}
                                <div class="menu-manager">
                                  <a data-nodrag ng-click="menu.editLink=true;menu.currentlyEditingLink=subItem;menu.editLinkText=subItem.title;menu.editLinkURL=subItem.url">Edit</a>
                                  <a data-nodrag ng-click="newSubItem(this)">Add</a>
                                  <a data-nodrag ng-click="remove(this)">Remove</a>
                                </div>
                              </div>
                              <ol ui-tree-nodes="options" ng-model="subItem.items">
                                {subItem.items &&
                                  subItem.items.map((subItem1: any) => (
                                    <li key={nanoid()} ng-repeat="subItem1 in subItem.items" ui-tree-node>
                                      <div ui-tree-handle>
                                        {subItem1.title}
                                        <div class="menu-manager">
                                          <a data-nodrag ng-click="menu.editLink=true;menu.currentlyEditingLink=subItem1;menu.editLinkText=subItem1.title;menu.editLinkURL=subItem1.url">Add</a>
                                          <a data-nodrag ng-click="remove(this)">Remove</a>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                              </ol>
                            </li>
                          ))}
                      </ol>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
          <div ng-show="menu.editLink">
            <div ng-show="menu.editLinkText">
              <div class="half-width">
                <label for="text" translate="menu_edit_link_text"></label>
                <input value="text" type="text" ng-model="menu.editLinkText" ng-change="updateLink()" />
              </div>
              <div class="half-width">
                <label for="url" translate="menu_edit_link_url"></label>
                <input value="url" type="text" ng-model="menu.editLinkURL" ng-change="updateLink()" />
              </div>
            </div>
            <div class="confirm" ng-show="menu.confirm">
              <p translate="menu_confirm"></p>
              <button class="btn-error" ng-click="menu.confirm=false;deleteMenu();menu.panel='manage'" translate="yes"></button>
              <button class="btn-success" ng-click='menu.confirm=false' translate="no"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuComponent;