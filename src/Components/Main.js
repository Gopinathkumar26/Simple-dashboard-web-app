import React, { useState } from 'react';
import './Main.css';

const dummy_content = {
  Category1: [
    { id: 1, name: "Widget 1", data: "Some data" },
    { id: 2, name: "Widget 2", data: "More data" },
  ],
  Category2: [
    { id: 1, name: "Widget A", data: "Data A" },
    { id: 2, name: "Widget B", data: "Data B" },
  ],
  Category3: [
    { id: 1, name: "Widget X", data: "X data" },
    { id: 2, name: "Widget Y", data: "Y data" },
  ],
};

const Main = () => {
  // state management for the category and widgets
  const [dashboardContent, setDashboardContent] = useState(dummy_content);
  // state management for the widget form
  const [newCategory, setNewCategory] = useState('');
  const [newWidgetName, setNewWidgetName] = useState('');
  const [newWidgetData, setNewWidgetData] = useState('');
  // state management for the selected category
  const [selectedCategory, setSelectedCategory] = useState('');
  // state management for the search term
  const [searchTerm, setSearchTerm] = useState('');
  // state management for the open and close widget form
  const [isOpen, setIsOpen] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    if ((selectedCategory || newCategory) && newWidgetName && newWidgetData) {
      const category = selectedCategory || newCategory;
      setDashboardContent(prevContent => ({
        ...prevContent,
        [category]:
          [
            ...(prevContent[category] || []),
            {
              id: prevContent[category] ? prevContent[category].length + 1 : 1,
              name: newWidgetName,
              data: newWidgetData
            }
          ]
      }));
      setSelectedCategory('');
      setNewCategory('');
      setNewWidgetName('');
      setNewWidgetData('');
      setIsOpen(false);
    }
  };

  const deleteWidget = (category, widgetId) => {
    setDashboardContent(prevContent => ({
      ...prevContent,
      [category]: prevContent[category].filter(widget => widget.id !== widgetId)
    }));
  };

  const deleteCategory = (category) => {
    setDashboardContent(prevContent => {
      const { [category]: deletedCategory, ...rest } = prevContent;
      return rest;
    });
  };

  return (
    <div className="dashboard">
      {/* dashboard header section */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <input
          type="text"
          placeholder="Search widgets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"/>
        {
          !isOpen &&
          <button className='add-button'
            onClick={() => setIsOpen(true)}>Add Widget +</button>
        }
      </div>
      {
        isOpen &&
      // widget form
        <form onSubmit={handleSubmit}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select Category</option>
            {Object.keys(dashboardContent).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}/>
          <input
            type="text"
            placeholder="Widget Name"
            value={newWidgetName}
            onChange={(e) => setNewWidgetName(e.target.value)} 
            required/>
          <input
            type="text"
            placeholder="Widget Data"
            value={newWidgetData}
            onChange={(e) => setNewWidgetData(e.target.value)}
            required />
          <button type="submit"
            className='add-button'>Add Widget</button>
          <button type="button"
            className='cancel-button'
            onClick={() => setIsOpen(false)}>Cancel</button>
        </form>
      }
      {/* dashboard content section */}
      {
        Object.entries(dashboardContent).map(([category, widgets]) => {
          const filteredWidgets = widgets.filter(widget =>
            widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            widget.data.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredWidgets.length === 0) return null;

          return (
            <div key={category} className="category">
              <h2>{category}</h2>
              <span className="cross-icon"
                onClick={() => deleteCategory(category)}></span>
              <div className="widgets">
                {
                  filteredWidgets.map(widget => (
                    <div key={widget.id} className="widget">
                      <h3>{widget.name}</h3>
                      <p>{widget.data}</p>
                      <span className="cross-icon" onClick={() => deleteWidget(category, widget.id)}></span>
                    </div>
                  ))
                }
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default Main;
