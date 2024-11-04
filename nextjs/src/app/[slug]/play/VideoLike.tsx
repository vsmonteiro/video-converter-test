import { LikeButton } from "./LikeButton";

export async function getLikes(videoId: number): Promise<number> {
  const response = await fetch(`${process.env.DJANGO_API_URL}/videos/${videoId}/likes`, {
    next: {
      revalidate: 60,
    },
  });

  return (await response.json()).likes;
}

export type VideoLikeCounterProps = {
  videoId: number;
  likes?: number;
};

export async function VideoLikeCounter(props: VideoLikeCounterProps) {
  const { videoId, likes: propLikes } = props;
  const likes = propLikes ? propLikes : await getLikes(videoId);
  return <LikeButton videoId={videoId} likes={likes} />;
}