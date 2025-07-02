import { cn } from "@/lib/utils";

export interface TestimonialAuthor {
  name: string;
  handle: string;
  avatar: string;
}

interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
}

export function TestimonialCard({ author, text, href }: TestimonialCardProps) {
  return (
    <div className="flex flex-col items-center bg-card rounded-xl shadow-md p-6 m-4 max-w-xs min-w-[250px]">
      <img
        src={author.avatar}
        alt={author.name}
        className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-primary"
      />
      <p className="text-base text-muted-foreground mb-4">{text}</p>
      <div className="flex flex-col items-center">
        <span className="font-semibold text-foreground">{author.name}</span>
        <span className="text-xs text-muted-foreground">{author.handle}</span>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline mt-1"
          >
            View Profile
          </a>
        )}
      </div>
    </div>
  );
} 