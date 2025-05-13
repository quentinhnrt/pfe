import PostCard from "@/features/post-card/PostCard";
import {getCurrentUser, getUserById} from "@/lib/users";
import FollowButton from "@/components/FollowButton";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUserById(id)
  const currentUser = await getCurrentUser()

  return (
    <div>
      <h1>{user.firstname}</h1>

        <FollowButton user={user} currentUser={currentUser ?? undefined} />

      <div className={"space-y-8 max-w-7xl mx-auto"}>
        {user.posts?.length &&
          user.posts.map((post) => (
            <PostCard post={post} key={"post-" + post.id} />
          ))}
      </div>
    </div>
  );
}
