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

        <div className="container mx-auto py-6 md:py-10 px-4 md:px-6">
          <FilterInfoTitle
            filterType={filterType}
            filterDate={dateRange}
            onClear={() => {
              resetFilter()
            }}
          />

          <div className="flex flex-col xl:flex-row gap-8 md:gap-10">
            {/* Calendar Sidebar - Above grid on mobile, sticky on desktop */}
            <div className="w-full xl:w-[320px] order-1 xl:order-2">
              <div className="bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_15px_40px_rgba(0,0,0,0.03)] rounded-[2rem] p-4 xl:sticky xl:top-24">
                <div className="p-1">
                  <h3 className="text-[10px] font-black tracking-[0.2em] text-stone-400 uppercase mb-4 ml-4">Filter by Date</h3>
                  <DayPicker
                    captionLayout="dropdown"
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDayClick}
                    pagedNavigation
                    className="mx-auto scale-90 md:scale-100 origin-top"
                  />
                  {(dateRange.from || dateRange.to) && (
                    <button 
                      onClick={resetFilter}
                      className="w-full mt-2 py-2 text-[10px] font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest border-t border-stone-100 transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 order-2 xl:order-1">
              {allStories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
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
                <div className="min-h-[400px] flex items-center justify-center">
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
                </div>
              )}
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
            backgroundColor: "rgba(243, 241, 237, 0.8)",
            backdropFilter: "blur(12px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[95vw] md:w-[85vw] lg:w-[60vw] xl:w-[45vw] h-[92vh] bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden z-[1000] outline-none relative"
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
            backgroundColor: "rgba(43, 40, 36, 0.4)",
            backdropFilter: "blur(8px)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[92vw] md:w-[70vw] lg:w-[45vw] h-[85vh] bg-white rounded-[2rem] mx-auto mt-10 md:mt-14 p-0 overflow-hidden shadow-2xl z-50 border border-white/20"
      >
        <div className="h-full overflow-y-auto scrollbar-hide">
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
        </div>
      </Modal>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl md:rounded-full bg-stone-800 hover:bg-black shadow-[0_20px_40px_rgba(0,0,0,0.2)] fixed right-6 bottom-6 md:right-10 md:bottom-10 z-[60] transition-all"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }}
      >
        <IoMdAdd className="text-[28px] md:text-[32px] text-white" />
      </motion.button>


      <ToastContainer />
    </div>
  )
}

export default Home
