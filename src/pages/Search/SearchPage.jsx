import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getVideosBySearch } from '../../redux/videoSlice'
import { Container, Spinner } from 'react-bootstrap'
import VideoRecommend from '../../components/videoRecommend/VideoRecommend'

export default function SearchPage() {
  const { query } = useParams()
  console.log(query)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getVideosBySearch(query))
  }, [query, dispatch])
  
  const {searchedVideos,loading}=useSelector((state)=>state.searchVideo)
  
  return (
   
    <Container>

      {!loading && searchedVideos ? (
        searchedVideos?.map((video) =>
          <VideoRecommend key={video.id} relatedVideo={video} SearchPage />
        )) : (
        <Spinner variant="light" animation="border" />
      )}

    </Container>
  )
}
