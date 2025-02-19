import { useState } from 'react'
import './_categoriesBar.css'
import { useDispatch } from 'react-redux'
import { getPopularVideos, getVideosByCategory } from '../../redux/videoSlice'

const keywords = [
    "All",
    "Gaming",
    "Technology",
    "Education",
    "Health & Fitness",
    "Lifestyle",
    "Travel",
    "Food & Cooking",
    "Beauty & Fashion",
    "DIY & Crafts",
    "Music",
    "Comedy",
    "Vlogging",
    "Product Reviews",
    "Unboxing",
    "How-to & Style",
    "Motivation & Self-help",
    "News & Politics",
    "Science & Nature",
    "Sports",
    "Finance & Investment",
    "Real Estate",
    "Personal Development",
    "Movies & TV Shows",
    "Animation",
    "History",
    "Art & Design",
    "Family & Kids",
    "Pets & Animals",
    "Automotive",
    "Photography & Videography",
    "Documentary",
    "ASMR",
    "Podcasts",
    "Hobbies & Interests",
    "Language Learning",
    "Spirituality",
    "Environment & Sustainability"
]

export default function CategoriesBar() {

  const [activeElement, setActiveElement] = useState('All')
  const dispatch=useDispatch()
  const handleClick = (keyword) => {
    setActiveElement(keyword)
    if (keyword === 'All') {
      dispatch(getPopularVideos())
    } else {
      dispatch(getVideosByCategory(keyword))
    }
  }
  return (
    <div className='categories_bar'>
      {keywords.map((keyword, i) =>
        <span key={i}
        onClick={()=>handleClick(keyword)}
        className={activeElement===keyword?'active':''}
        >{keyword}</span>)}
    </div>
  )
}
