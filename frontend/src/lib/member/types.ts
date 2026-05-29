export type MemberUser = {
  id: number;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt?: string;
};

export type MemberContributions = {
  member: MemberUser;
  stats: {
    comments: number;
    blogPosts: number;
    forumTopics: number;
    forumReplies: number;
  };
  blogPosts: Array<{
    id: number;
    slug: string;
    title: string;
    status: string;
    date: string;
    updatedAt?: string;
  }>;
  forumTopics: Array<{
    id: number;
    slug: string;
    title: string;
    status: string;
    forumSlug: string;
    forumTitle: string;
    replyCount: number;
    lastActivity: string;
  }>;
  comments: Array<{
    id: number;
    body: string;
    status: string;
    createdAt: string;
    postTitle: string;
    postSlug: string;
  }>;
  forumReplies: Array<{
    id: number;
    body: string;
    status: string;
    createdAt: string;
    topicId: number;
    topicSlug: string;
    topicTitle: string;
    forumSlug: string;
    forumTitle: string;
  }>;
  forums: Array<{
    id: number;
    slug: string;
    title: string;
    description: string;
    icon: string;
    status: string;
    createdByMe: boolean;
    myTopics: number;
    myReplies: number;
  }>;
};
