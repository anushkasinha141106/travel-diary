import React, { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import axiosInstance from "../../utils/axiosInstance"
import TravelStoryCard from "../../components/TravelStoryCard"
import { ToastContainer, toast } from "react-toastify"
import { IoMdAdd } from "react-icons/io"
import Modal from "react-modal"
import AddEditTravelStory from "../../components/AddEditTravelStory"
import ViewTravelStory from "./ViewTravelStory"
import EmptyCard from "../../components/EmptyCard"
import { DayPicker } from "react-day-picker"
import moment from "moment"
import FilterInfoTitle from "../../components/FilterInfoTitle"
import { getEmptyCardMessage } from "../../utils/helper"
import { motion } from "framer-motion"

const Home = () => {
  const [allStories, setAllStories] = useState([])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")

  const [dateRange, setDateRange] = useState({ from: null, to: null })

  // console.log(allStories)

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  })

  // Get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/travel-story/get-all")

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // Handle Edit Story
  const handleEdit = async (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data })
  }

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  }

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id

    try {
      const response = await axiosInstance.put(
        "/travel-story/update-is-favourite/" + storyId,
        {
          isFavorite: !storyData.isFavorite,
        }
      )

      if (response.data && response.data.story) {
        toast.success("Story updated successfully!")
        getAllTravelStories()
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id

    try {
      const response = await axiosInstance.delete(
        "/travel-story/delete-story/" + storyId
      )

      if (response.data && !response.data.error) {
        toast.success("Story deleted successfully!")

        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))

        getAllTravelStories()
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // search story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/travel-story/search", {
        params: {
          query: query,
        },
      })

      if (response.data && response.data.stories) {
        setFilterType("search")
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // Clear search
  const handleClearSearch = () => {
    setFilterType("")
    getAllTravelStories()
  }

  // Handle filter travel story by date range
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null
      const endDate = day.to ? moment(day.to).valueOf() : null

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-story/filter", {
          params: { startDate, endDate },
        })

        if (response.data && response.data.stories) {
          setFilterType("date")
          setAllStories(response.data.stories)
        }
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // Handle date range click
  const handleDayClick = (day) => {
    setDateRange(day)
    filterStoriesByDate(day)
  }

  const resetFilter = () => {
    setDateRange({ from: null, to: null })
    setFilterType("")
    getAllTravelStories()
  }

  useEffect(() => {
    getAllTravelStories()

    return () => {}
  }, [])

  return (
    <div className="min-h-screen bg-[#f3f1ed] relative overflow-x-hidden font-sans tracking-tight">
      {/* User-Provided Background Image (High Visibility) */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: 'url("https://i.pinimg.com/736x/8e/3e/32/8e3e3289053075276c9ef56e54581452.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'sepia(20%) brightness(1.1)'
        }}
      />
      
      {/* Depth and Texture Overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#f3f1ed]/40 to-[#f3f1ed]/80 z-0 pointer-events-none" />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(#968f81 1.5px, transparent 1.5px), linear-gradient(90deg, #968f81 1.5px, transparent 1.5px)',
          backgroundSize: '70px 70px'
        }}
      />

      <div className="relative z-10">


        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchNote={onSearchStory}
          handleClearSearch={handleClearSearch}
        />

        <div className="container mx-auto py-10 px-6">
          <FilterInfoTitle
            filterType={filterType}
            filterDate={dateRange}
            onClear={() => {
              resetFilter()
            }}
          />

          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              {allStories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {allStories.map((item) => {
                    return (
                      <TravelStoryCard
                        key={item._id}
                        imageUrl={item.imageUrl}
                        title={item.title}
                        story={item.story}
                        date={item.visitedDate}
                        visitedLocation={item.visitedLocation}
                        isFavourite={item.isFavorite}
                        charm={item.charm}
                        charmPosition={item.charmPosition}
                        onEdit={() => handleEdit(item)}
                        onClick={() => handleViewStory(item)}
                        onFavouriteClick={() => updateIsFavourite(item)}
                      />
                    )
                  })}
                </div>
              ) : (
                <EmptyCard
                  imgSrc={
                    "https://images.pexels.com/photos/5706021/pexels-photo-5706021.jpeg?auto=compress&cs=tinysrgb&w=600"
                  }
                  message={getEmptyCardMessage(filterType)}
                  setOpenAddEditModal={() =>
                    setOpenAddEditModal({
                      isShown: true,
                      type: "add",
                      data: null,
                    })
                  }
                />
              )}
            </div>

            <div className="w-full lg:w-[350px]">
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-4 sticky top-24">
                <div className="p-3">
                  <DayPicker
                    captionLayout="dropdown"
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDayClick}
                    pagedNavigation
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Add & Edit Travel Story Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[90vw] md:w-[50%] lg:w-[40%] h-[85vh] bg-white rounded-3xl mx-auto mt-10 shadow-2xl overflow-hidden z-50 outline-none"
      >
        <AddEditTravelStory
          storyInfo={openAddEditModal.data}
          type={openAddEditModal.type}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }}
          getAllTravelStories={getAllTravelStories}
          onDeleteClick={() => {
            if (openAddEditModal.data) {
              deleteTravelStory(openAddEditModal.data);
              setOpenAddEditModal({ isShown: false, type: "add", data: null });
            }
          }}
        />
      </Modal>

      {/* View travel story modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
            handleEdit(openViewModal.data || null)
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null)
          }}
        />
      </Modal>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 flex items-center justify-center rounded-full bg-[#b27d7d] hover:bg-[#a16c6c] shadow-[0_15px_30px_rgba(178,125,125,0.3)] fixed right-10 bottom-10 z-50 transition-colors"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }}
      >
        <IoMdAdd className="text-[32px] text-white" />
      </motion.button>

      <ToastContainer />
    </div>
  )
}

export default Home
