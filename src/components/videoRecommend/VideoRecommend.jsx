

import { Col, Row } from 'react-bootstrap';
import './_videoRecommend.css';
import moment from 'moment';
import numeral from 'numeral';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChannelIcon } from '../../redux/videoSlice';

export default function VideoRecommend({ relatedVideo, SearchPage }) {
  const {
    id: videoId,
    snippet: {
      channelId,
      channelTitle,
      description,
      title,
      publishedAt,
      thumbnails,
    },
    contentDetails: {
      duration,
    },
    statistics: {
      viewCount,
    },
  } = relatedVideo;

  const seconds = moment.duration(duration).asSeconds();
  const videoDuration = moment.utc(seconds * 1000).format('mm:ss');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const channelIcon = useSelector((state) => state.searchVideo.channelIcons[channelId]);

  useEffect(() => {
    dispatch(getChannelIcon(channelId));
  }, [channelId, dispatch]);

  const handleClick = () => {
    navigate(`/watch/${videoId}`);
  };

  return (
    <Row className='py-2 m-1 videoHorizontal' onClick={handleClick}>
      <Col xs={6} md={SearchPage ? 4 : 6} className='videoHorizontal__left'>
        <LazyLoadImage
          effect="opacity" // Smooth fade-in effect
          src={thumbnails.default.url}
          className='videoHorizontal__thumbnail'
          wrapperClassName='videoHorizontal__thumbnail-wrapper'
        />
        <span className='videoHorizontal__duration'>{videoDuration}</span>
      </Col>
      <Col xs={6} md={SearchPage ? 8 : 6} className='p-0 videoHorizontal__right'>
        <p className='mb-1 videoHorizontal__title'>{title}</p>
        
        <div className='my-1 videoHorizontal__channel d-flex'>
          {SearchPage && <img src={channelIcon} alt={channelTitle} className='videoHorizontal__channel-icon' />}
          <p className='mb-0 p-0'>{channelTitle}</p>
        </div>

        <div className='videoHorizontal__details'>
          {numeral(viewCount).format('0.a').toUpperCase()} views{' • '}
          {moment(publishedAt).fromNow()}
        </div>
        {SearchPage && <p className='mt-1 videoHorizontal__desc'>{description}</p>}
      </Col>
    </Row>
  );
}