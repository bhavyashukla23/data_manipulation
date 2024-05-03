import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [addDataVisible, setAddDataVisible] = useState(false);
  const [updateDataVisible, setUpdateDataVisible] = useState(false);
  const [id, setId] = useState('');
  const [data, setData] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:5000/api/add', { data });
      setMessage('Data added successfully');
      setData(''); // To Clear input field
      setTimeout(() => setMessage(''), 5000); // Clear message after 3 seconds
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:5000/api/update', { id, data });
      setMessage('Data updated successfully');
      setId(''); 
      setData('');
      setTimeout(() => setMessage(''), 5000);
      window.location.reload(); 
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/count');
      setMessage(`Add count: ${response.data.add}, Update count: ${response.data.update}`);
      setTimeout(() => setMessage(''), 20000); 
      window.location.reload(); 
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  return (
    <div>
      <button onClick={() => { setAddDataVisible(true); setUpdateDataVisible(false); }}>Add Data</button>
      <button onClick={() => { setUpdateDataVisible(true); setAddDataVisible(false); }}>Update Data</button>
      {addDataVisible && (
        <div>
          <input
            type="text"
            placeholder="Enter data"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <button onClick={handleAdd}>Submit</button>
        </div>
      )}
      {updateDataVisible && (
        <div>
          <input
            type="text"
            placeholder="Enter ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter data"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <button onClick={handleUpdate}>Submit</button>
        </div>
      )}
      <button onClick={handleCount}>Count</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
