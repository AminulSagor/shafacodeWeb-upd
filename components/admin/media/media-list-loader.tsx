import { getAllMedia } from '@/actions/media/get-all-media';
import MediaList from './media-list';

const MediaListLoader = async () => {
  const allMedia = await getAllMedia();
  return <MediaList media={allMedia} />;
};

export default MediaListLoader;
