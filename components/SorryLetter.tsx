"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

interface SorryLetterProps {
  onComplete: () => void;
  onClose: () => void;
}

const SORRY_TEXT = `Hey misu.

I know I'm not always good with words.
And sometimes I mess up in ways I don't even realize until later.
I overthink — you know this about me — and sometimes I disappear into my own head
and forget that you're right there, waiting.

I know I didn't always give you the time you deserved.
I should have shown up better in the moments that mattered to you.
Especially your birthday. You deserved to have me there at midnight, and I wasn't.

I'm sorry, Misri.

You deserve someone who gets it right every time.
I'm not that guy yet. But I'm trying to be. For you.

Because you never gave up on us, not even once.
You baked me a cheesecake before you even knew me properly.
You believed in me when I didn't believe in myself.
You always put me first, even when I forget to say thank you.

You understand me even when I can't find the words.
You are the most caring person I have ever known.

I promise to show up better.
I promise to be the guy who gets it right.

Thank you for loving me exactly as I am.

For you, babyy. Always. ❤️

— pegu`;

export default function SorryLetter({ onComplete, onClose }: SorryLetterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showPaperPlane, setShowPaperPlane] = useState(false);
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep ref in sync without re-triggering the effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText("");
    setIsTypingComplete(false);

    const interval = setInterval(() => {
      if (indexRef.current < SORRY_TEXT.length) {
        indexRef.current++;
        setDisplayedText(SORRY_TEXT.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
        onCompleteRef.current();

        // Show paper plane after a pause
        setTimeout(() => {
          setShowPaperPlane(true);
        }, 1500);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom as text types
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.95)",
        zIndex: 300,
        padding: "5vw",
      }}
      onClick={isTypingComplete ? onClose : undefined}
    >
      {/* Scrollable text container with fade masks */}
      <div
        style={{
          position: "relative",
          maxWidth: 600,
          maxHeight: "75vh",
          width: "100%",
        }}
      >
        {/* Top fade mask */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 40,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Scrollable text */}
        <div
          ref={scrollRef}
          className="font-cormorant"
          style={{
            maxHeight: "75vh",
            overflowY: "auto",
            fontSize: "clamp(16px, 2.2vw, 22px)",
            lineHeight: 1.9,
            color: "#f5f0e8",
            whiteSpace: "pre-wrap",
            textAlign: "left",
            letterSpacing: 0.3,
            paddingTop: 20,
            paddingBottom: 40,
            scrollBehavior: "smooth",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {displayedText}
          {!isTypingComplete && <span className="typewriter-cursor" />}
        </div>

        {/* Bottom fade mask */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 50,
            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Paper plane animation */}
      {showPaperPlane && (
        <motion.div
          className="paper-plane-fly"
          style={{
            position: "fixed",
            bottom: "30%",
            left: 0,
            zIndex: 310,
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            style={{ opacity: 0.7 }}
          >
            <path
              d="M5 20 L35 5 L25 20 L35 35 Z"
              fill="none"
              stroke="#c9a84c"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M5 20 L25 20"
              stroke="#c9a84c"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      )}

      {/* Close hint */}
      {isTypingComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 4, duration: 1 }}
          className="font-caveat"
          style={{
            position: "fixed",
            bottom: 30,
            fontSize: 14,
            color: "#f5f0e8",
          }}
        >
          tap anywhere to close
        </motion.div>
      )}
    </div>
  );
}
