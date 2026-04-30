import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import type { AppState, Post, PostType, Reaction, ReactionType } from "../types";
import { mockPosts, mockUsers, currentUser, mockThanks } from "../data/mockData";

type AppAction =
  | { type: "ADD_POST"; payload: Omit<Post, "id" | "reactions" | "createdAt"> }
  | { type: "TOGGLE_REACTION"; payload: { postId: string; reactionType: ReactionType } }
  | { type: "PROMOTE_TO_KNOWLEDGE"; payload: { postId: string; tags: string[] } }
  | { type: "RESOLVE_POST"; payload: { postId: string } };

const initialState: AppState = {
  posts: mockPosts,
  users: mockUsers,
  currentUser,
  thanks: mockThanks,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_POST": {
      const newPost: Post = {
        ...action.payload,
        id: `post-${Date.now()}`,
        reactions: [],
        createdAt: new Date().toISOString(),
        resolved: false,
      };
      return { ...state, posts: [newPost, ...state.posts] };
    }

    case "TOGGLE_REACTION": {
      const { postId, reactionType } = action.payload;
      const userId = state.currentUser.id;
      const posts = state.posts.map((post) => {
        if (post.id !== postId) return post;
        const existingReaction = post.reactions.find(
          (r) => r.userId === userId && r.type === reactionType
        );
        if (existingReaction) {
          return {
            ...post,
            reactions: post.reactions.filter((r) => r.id !== existingReaction.id),
          };
        } else {
          const newReaction: Reaction = {
            id: `r-${Date.now()}-${Math.random()}`,
            type: reactionType,
            userId,
          };
          return { ...post, reactions: [...post.reactions, newReaction] };
        }
      });
      return { ...state, posts };
    }

    case "PROMOTE_TO_KNOWLEDGE": {
      const { postId, tags } = action.payload;
      const posts = state.posts.map((post) => {
        if (post.id !== postId) return post;
        return { ...post, type: "knowledge" as PostType, tags };
      });
      return { ...state, posts };
    }

    case "RESOLVE_POST": {
      const posts = state.posts.map((post) => {
        if (post.id !== action.payload.postId) return post;
        return { ...post, resolved: true };
      });
      return { ...state, posts };
    }

    default:
      return state;
  }
}

type AppContextType = {
  state: AppState;
  addPost: (post: Omit<Post, "id" | "reactions" | "createdAt">) => void;
  toggleReaction: (postId: string, reactionType: ReactionType) => void;
  promoteToKnowledge: (postId: string, tags: string[]) => void;
  resolvePost: (postId: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addPost = (post: Omit<Post, "id" | "reactions" | "createdAt">) => {
    dispatch({ type: "ADD_POST", payload: post });
  };

  const toggleReaction = (postId: string, reactionType: ReactionType) => {
    dispatch({ type: "TOGGLE_REACTION", payload: { postId, reactionType } });
  };

  const promoteToKnowledge = (postId: string, tags: string[]) => {
    dispatch({ type: "PROMOTE_TO_KNOWLEDGE", payload: { postId, tags } });
  };

  const resolvePost = (postId: string) => {
    dispatch({ type: "RESOLVE_POST", payload: { postId } });
  };

  return (
    <AppContext.Provider value={{ state, addPost, toggleReaction, promoteToKnowledge, resolvePost }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
