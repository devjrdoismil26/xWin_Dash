import React, { useEffect, useState } from "react";
import { socialBufferApi } from '@/api/socialBuffer';
import { useSocialBufferStore } from '@/stores/socialBufferStore';
import type { SocialPost } from "@/types/socialBuffer";

export const SocialBufferDashboard: React.FC = () => {
  const { posts, accounts, setPosts, setAccounts, setLoading, isLoading } =
    useSocialBufferStore();

  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadData();

  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const [postsRes, accountsRes] = await Promise.all([
        socialBufferApi.getPosts(),
        socialBufferApi.getAccounts(),
      ]);

      setPosts(postsRes.data.data);

      setAccounts(accountsRes.data.data);

    } catch (error) {
    } finally {
      setLoading(false);

    } ;

  const filteredPosts = posts.filter((post: unknown) => {
    if (filter === "all") return true;
    return post.status === filter;
  });

  const stats = {
    total: posts.length,
    draft: posts.filter((p: unknown) => p.status === "draft").length,
    scheduled: posts.filter((p: unknown) => p.status === "scheduled").length,
    published: posts.filter((p: unknown) => p.status === "published").length,};

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h1 className="text-3xl font-bold">Social Buffer</h1>
        <p className="text-gray-600">Manage your social media posts</p>
      </div>

      {/* Stats */}
      <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-gray-500 text-sm">Total Posts</h3>
          <p className="text-2xl font-bold">{stats.total}</p></div><div className=" ">$2</div><h3 className="text-gray-500 text-sm">Drafts</h3>
          <p className="text-2xl font-bold">{stats.draft}</p></div><div className=" ">$2</div><h3 className="text-gray-500 text-sm">Scheduled</h3>
          <p className="text-2xl font-bold">{stats.scheduled}</p></div><div className=" ">$2</div><h3 className="text-gray-500 text-sm">Published</h3>
          <p className="text-2xl font-bold">{stats.published}</p>
        </div>

      {/* Connected Accounts */}
      <div className=" ">$2</div><h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
        <div className="{accounts.length === 0 ? (">$2</div>
            <p className="text-gray-500">No accounts connected yet</p>
          ) : (
            accounts.map((account: unknown) => (
              <div
                key={ account.id }
                className="flex items-center gap-2 border p-3 rounded">
           
        </div>{account.profile_image && (
                  <img
                    src={ account.profile_image }
                    alt=""
                    className="w-8 h-8 rounded-full"
                  / />
                )}
                <div>
           
        </div><p className="font-semibold">{account.account_name}</p>
                  <p className="text-sm text-gray-500">{account.platform}</p>
      </div>
    </>
  ))
          )}
        </div>

      {/* Filters */}
      <div className=" ">$2</div><div className="{["all", "draft", "scheduled", "published", "failed"].map(">$2</div>
            (status: unknown) => (
              <button
                key={ status }
                onClick={ () => setFilter(status) }
                className={`px-4 py-2 rounded ${
                  filter === status
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                } `}
  >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>

      {/* Posts List */}
      <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-xl font-semibold">Posts</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" />
            + New Post
          </button></div><div className="{filteredPosts.length === 0 ? (">$2</div>
            <p className="text-gray-500 text-center py-8">No posts found</p>
          ) : (
            <div className="{filteredPosts.map((post: unknown) => (">$2</div>
                <div
                  key={ post.id }
                  className="border p-4 rounded hover:bg-gray-50">
           
        </div><div className=" ">$2</div><div className="{post.title && (">$2</div>
                        <h3 className="font-semibold mb-1">{post.title}</h3>
                      )}
                      <p className="text-gray-700 mb-2" />
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className=" ">$2</div><span
                          className={`px-2 py-1 rounded ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800"
                              : post.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : post.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100"
                          } `}>
           
        </span>{post.status}
                        </span>
                        {post.scheduled_at && (
                          <span className="{new Date(post.scheduled_at).toLocaleString()}">$2</span>
      </span>
    </>
  )}
                      </div>
                    <div className="{post.social_accounts?.map((acc: unknown) => (">$2</div>
                        <span
                          key={ acc.id }
                          className="text-xs bg-gray-100 px-2 py-1 rounded">
            {acc.platform}
          </span>
                      ))}
                    </div>
    </div>
  ))}
            </div>
          )}
        </div>
    </div>);};
