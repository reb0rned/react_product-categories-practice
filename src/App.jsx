/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames'

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';


const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(category => category.id === product.categoryId) || null
  const user = usersFromServer.find(user => user.id === category.ownerId) || null

  return {
    ...product,
    category,
    user
  }
})

export const App = () => {
  const [filteredByName, setFilteredByName] = useState('All');
  const [filteredByCtg, setFilteredByCtg] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleResetFilters = () => {
    setFilteredByName('All');
    setFilteredByCtg([]);
    setSearchQuery('');
  };

  const filteredProducts = products.filter(product => {
    const matchesUser = filteredByName === 'All' || product.user.name === filteredByName;

    const matchesCategory = filteredByCtg.length === 0 || filteredByCtg.includes(product.category.title);

    const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUser && matchesCategory && matchesSearchQuery;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': filteredByName === 'All'
                })}
                onClick={() => setFilteredByName('All')}
              >
                All
              </a>

              {
                usersFromServer.map(user => {
                  return (
                    <a
                      key={user.id}
                      data-cy="FilterUser"
                      href={`#/${user.name}`}
                      className={cn({
                        'is-active': filteredByName === `${user.name}`
                      })}
                      onClick={() => setFilteredByName(user.name)}
                    >
                      {user.name}
                    </a>
                  )
                })
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': filteredByCtg.length !== 0
                })}
                onClick={() => setFilteredByCtg([])}
              >
                All
              </a>

              {
                categoriesFromServer.map(category => {
                  return (
                    <a
                    data-cy="Category"
                    className={cn('button mr-2 my-1', {
                      'is-info': filteredByCtg.includes(category.title)
                    })}
                    href={`#/${category.title}`}
                    key={category.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setFilteredByCtg(prev =>
                        prev.includes(category.title)
                          ? prev.filter(id => id !== category.title)
                          : [...prev, category.title]
                      );
                    }}
                  >
                    {category.title}
                  </a>
                  )
                })
              }
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>
                    <td data-cy="ProductUser"
                    className={cn({
                      'has-text-link': product.user.sex === 'm',
                      'has-text-danger': product.user.sex === 'f'
                    })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="has-text-centered" data-cy="NoMatchingMessage">
                    No products matching selected criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};
