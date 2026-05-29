import type { StoryItem } from "./types";

type StoryStripProps = {
  ariaLabel?: string;
  onOpenStory: (storyIndex: number) => void;
  stories: StoryItem[];
};

export function StoryStrip({ ariaLabel = "Review story placeholders", onOpenStory, stories }: StoryStripProps) {
  return (
    <div className="review-story-row" aria-label={ariaLabel}>
      {stories.map((story, storyIndex) => (
        <div className="review-story-item" key={story.id}>
          <button
            aria-label={`Open ${story.label} review story`}
            className="review-story-bubble"
            onClick={() => onOpenStory(storyIndex)}
            type="button"
          />
          <span className="review-story-label">{story.label}</span>
        </div>
      ))}
    </div>
  );
}
