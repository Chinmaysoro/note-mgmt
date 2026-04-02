'use client'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

function HomePage() {
  const initialFormData = {
    title: "",
    content: "",
    tags: []
  };
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedTag, setDebouncedTag] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:6546/api/v1/notes",
        {
          method: 'GET',
        }
      );

      const data = await response.json();
      setData(data.data)
    } catch (error) {
      console.log(error);

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  const handleEdit = (index) => {
    setFormData(data[index]);
    // setEditIndex(index);
    setEditId(data[index]._id)
  };

  const handleChange = (e) => {
    if (e.target.name === "tags") {
      const tagsArray = [...new Set(e.target.value.split(","))];

      setFormData((prev) => ({
        ...prev,
        tags: tagsArray
      }));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }

  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Please fill all fields")
      return;
    };


    if (editId) {
      try {
        const response = await fetch(`http://localhost:6546/api/v1/notes/${editId}`,
          {
            method: 'PATCH',
            headers: {
              'User-Agent': 'undici-stream-example',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) toast.success("Note edited successfully!!!")
        const data = await response.json();
        console.log(data);
        setEditId(null);
        await fetchData();
      } catch (error) {
        console.log(error);

      }


    } else {
      try {
        const response = await fetch("http://localhost:6546/api/v1/notes",
          {
            method: 'POST',
            headers: {
              'User-Agent': 'undici-stream-example',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) toast.success("Note added successfully!!!")
        const data = await response.json();
        console.log(data);
        await fetchData();
      } catch (error) {
        console.log(error);

      }
    }

    setFormData(initialFormData)
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:6546/api/v1/notes/${id}`,
        {
          method: 'DELETE',
          // headers: {
          //   'User-Agent': 'undici-stream-example',
          //   'Content-Type': 'application/json',
          // },
        }
      );

      if (response.ok) {
        if (response.ok) toast.success("Note deleted successfully!!!");
        await fetchData();
      }
    } catch (error) {

    }
  };


  const handleSearch = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (tag) params.tags = tag;
      const query = new URLSearchParams(params).toString();
      console.log(params);
      console.log(query);


      const response = await fetch(`http://localhost:6546/api/v1/notes?${query}`,
        {
          method: 'GET',
        }
      );

      const data = await response.json();
      console.log(data);

      setData(data.data)

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedTag(tag);
    }, 300);

    return () => clearTimeout(handler);
  }, [search, tag]);

  useEffect(() => {
    if (debouncedSearch || debouncedTag) {
      handleSearch();
    } else {
      fetchData();
    }
  }, [debouncedSearch, debouncedTag]);


  return (
    <>
      <div className="max-w-xl mx-auto mt-4 p-4 bg-white shadow rounded-2xl">
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input type='text' placeholder='Note title' onChange={handleChange} value={formData.title} name='title' className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <textarea
            placeholder="Content of the Note"
            onChange={handleChange}
            value={formData.content}
            name="content"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
          />
          <input type='text' placeholder='Tags' name='tags' value={formData.tags} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <button type='submit' className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer" >{editId != null ? "Update Note" : "Add Note"}</button>
        </form>

      </div>

      <div className="max-w-3xl mx-auto mt-6 flex flex-col sm:flex-row gap-3">

        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />

        <input
          type="text"
          placeholder="Filter by tag..."
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />

        {/* <button
          onClick={handleSearch} type='button'
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer"
        >
          Search
        </button> */}
        <button
          onClick={() => { fetchData(); setSearch(""); setTag("") }} type='button'
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium cursor-pointer"
        >
          reset
        </button>
      </div>

      {isLoading
        ? <p>Please Wait...</p>
        :
        <div className="flex flex-wrap gap-6 p-6">
          {data?.map((d, i) => (
            <div
              key={i}
              className="sm:w-[45%] lg:w-[30%] bg-white rounded-2xl shadow hover:shadow-md  p-5 border border-gray-100 relative"
            >
              <div className='flex justify-end'>
                <button className='m-1 bg-red-600 py-1 px-2 rounded-xl font-medium hover:bg-red-700 text-white cursor-pointer' onClick={() => handleDelete(d._id)}>Delete</button>
                {editId == d._id
                  ? <button className='m-1 bg-yellow-600 py-1 px-2 rounded-xl font-medium hover:bg-yellow-700 text-white cursor-pointer' onClick={() => { setEditId(null); setFormData(initialFormData) }}>Cancel update</button>
                  : <button className='m-1 bg-blue-600 py-1 px-2 rounded-xl font-medium hover:bg-blue-700 text-white cursor-pointer' onClick={() => handleEdit(i)}>Edit</button>
                }
              </div>

              <h1 className="text-lg font-semibold text-gray-800 mb-2">
                {d?.title}
              </h1>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {d?.content}
              </p>

              <div className="flex flex-wrap gap-2">
                {d?.tags?.map((t, j) => (
                  <span
                    key={j}
                    className="bg-sky-100 text-sky-700 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
      <ToastContainer />
    </>

  )


}

export default HomePage
