import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CommunityService } from "../services/communityService";
import { PrayerIntention } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, Plus, Share2, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PrayerIntentionsProps {
  userId: string;
  userName: string;
  isAdmin?: boolean;
}

export const PrayerIntentions: React.FC<PrayerIntentionsProps> = ({
  userId,
  userName,
  isAdmin = false,
}) => {
  const { t } = useTranslation();
  const [intentions, setIntentions] = useState<PrayerIntention[]>([]);
  const [newIntention, setNewIntention] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [prayedFor, setPrayedFor] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const unsubscribe = CommunityService.subscribeToIntentions((data) => {
      setIntentions(data);
    });

    // Attempt to scroll modal to top when opening
    setTimeout(() => {
      const container = document.getElementById(
        "prayer-intentions-scroll-container",
      );
      if (container) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);

    return () => unsubscribe();
  }, []);

  const handleAddIntention = async () => {
    if (!newIntention.trim()) return;
    try {
      if (editingId) {
        await CommunityService.updateIntention(editingId, newIntention.trim());
        setEditingId(null);
      } else {
        await CommunityService.addIntention(
          userId,
          userName,
          newIntention.trim(),
        );
      }
      setNewIntention("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding/editing intention:", error);
    }
  };

  const handleEdit = (intention: PrayerIntention) => {
    setEditingId(intention.id!);
    setNewIntention(intention.text);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Na pewno usunąć tę intencję?")) return;
    try {
      await CommunityService.deleteIntention(id);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleShare = async (intention: PrayerIntention) => {
    try {
      await navigator.share({
        title: `Modlitwa za: ${intention.userName}`,
        text: `🙏 Dołącz do modlitwy: "${intention.text}"\n\nŚciana Modlitwy Christian Culture ✨`,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share error or canceled", err);
    }
  };

  const handlePray = async (id: string) => {
    if (prayedFor[id]) return; // Already prayed

    // Optimistic local update
    setPrayedFor((prev) => ({ ...prev, [id]: true }));
    setIntentions((prev) =>
      prev.map((int) =>
        int.id === id
          ? { ...int, prayerCount: (int.prayerCount || 0) + 1 }
          : int,
      ),
    );

    // Impact feedback
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }

    try {
      await CommunityService.incrementPrayerCount(id);
    } catch (error) {
      console.error("Error incrementing prayer count:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">
            {t("community.intentions", "Ściana Modlitwy")}
          </h2>
          <p className="text-xs text-gold/80 font-medium uppercase tracking-widest">
            {t("community.pray_together", "MÓDLMY SIĘ RAZEM")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-gold/30 text-gold hover:bg-gold/10 rounded-full"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("community.add_intention", "Dodaj")}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-zinc-900/50 border border-gold/20 rounded-3xl p-4 space-y-4"
          >
            <textarea
              value={newIntention}
              onChange={(e) => setNewIntention(e.target.value)}
              placeholder={t(
                "community.intention_placeholder",
                "Napisz swoją intencję...",
              )}
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/50 transition-colors resize-none h-24"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="text-zinc-500"
              >
                {t("common.cancel", "Anuluj")}
              </Button>
              <Button
                size="sm"
                onClick={handleAddIntention}
                className="bg-gold text-black hover:bg-gold/80 font-bold"
              >
                {t("common.send", "Wyślij")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {intentions.map((intention) => {
          const isPrayed = prayedFor[intention.id!];
          return (
            <motion.div
              key={intention.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-zinc-900/30 border-white/5 hover:border-gold/20 transition-all rounded-3xl overflow-hidden group">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold uppercase">
                        {intention.userName
                          ? intention.userName.charAt(0)
                          : "U"}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-white">
                          {intention.userName}
                        </CardTitle>
                        <CardDescription className="text-[10px] text-zinc-500">
                          {new Date(intention.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    {intention.prayerCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-gold/10 text-gold border-none text-[10px] font-bold"
                      >
                        🙏 + {intention.prayerCount}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-200 text-lg sm:text-xl md:text-2xl leading-snug italic break-words whitespace-pre-wrap">
                    "{intention.text}"
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center bg-transparent">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-white"
                      onClick={() => handleShare(intention)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {(isAdmin || intention.userId === userId) && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-[#C5A059]"
                          onClick={() => handleEdit(intention)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-red-500"
                          onClick={() => handleDelete(intention.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant={isPrayed ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePray(intention.id!)}
                    className={`transition-all duration-300 font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-full px-6 ${
                      isPrayed
                        ? "bg-gold text-black hover:bg-gold shadow-[0_0_15px_rgba(226,184,89,0.5)] border-gold"
                        : "border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50"
                    }`}
                  >
                    <Heart
                      className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 transition-colors ${isPrayed ? "fill-black text-black" : "text-gold"}`}
                    />
                    {isPrayed
                      ? t("community.prayed", "POMODLONO")
                      : t("community.i_pray", "POMÓDL SIĘ")}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
