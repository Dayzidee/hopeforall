import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, COLLECTIONS } from '../services/db';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Sparkles, ArrowRight, RotateCcw, Loader } from 'lucide-react';

// Simplified Logic for Demo: 7 basic gifts (Romans 12:6-8)
const GIFTS = {
    PROPHECY: 'Prophecy',
    SERVICE: 'Service',
    TEACHING: 'Teaching',
    EXHORTATION: 'Exhortation',
    GIVING: 'Giving',
    LEADERSHIP: 'Leadership',
    MERCY: 'Mercy'
};

const QUESTIONS = [
    { id: 1, text: "I easily identify truth and error and feel compelled to speak up when something is wrong.", gift: GIFTS.PROPHECY },
    { id: 2, text: "I enjoy doing tasks behind the scenes that help others be effective.", gift: GIFTS.SERVICE },
    { id: 3, text: "I love explaining complex biblical truths so that others can understand them.", gift: GIFTS.TEACHING },
    { id: 4, text: "I naturally encourage those who are discouraged or struggling.", gift: GIFTS.EXHORTATION },
    { id: 5, text: "I manage my finances well so that I can generously support God's work.", gift: GIFTS.GIVING },
    { id: 6, text: "I can cast a vision and motivate others to work together to achieve it.", gift: GIFTS.LEADERSHIP },
    { id: 7, text: "I feel deep compassion for those who are hurting and want to alleviate their pain.", gift: GIFTS.MERCY },

    { id: 8, text: "I often get insights about people or situations that turn out to be true.", gift: GIFTS.PROPHECY },
    { id: 9, text: "I prefer doing practical jobs (cooking, setting up) rather than leading or teaching.", gift: GIFTS.SERVICE },
    { id: 10, text: "I enjoy researching and studying the Bible in depth.", gift: GIFTS.TEACHING },
    { id: 11, text: "People often come to me for advice or comfort when they have problems.", gift: GIFTS.EXHORTATION },
    { id: 12, text: "I find joy in meeting the financial needs of others anonymously.", gift: GIFTS.GIVING },
    { id: 13, text: "I like organizing events and delegating tasks to ensure things run smoothly.", gift: GIFTS.LEADERSHIP },
    { id: 14, text: "I am drawn to people who are lonely, outcast, or distressed.", gift: GIFTS.MERCY },
];

export default function SpiritualGifts() {
    const { user } = useAuth();
    const [started, setStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [result, setResult] = useState<string[]>([]); // Top gifts
    const [loading, setLoading] = useState(false);

    const handleStart = () => {
        setStarted(true);
        setCurrentQuestion(0);
        setScores({});
        setResult([]);
    };

    const handleAnswer = (value: number) => {
        // value: 1 (Strongly Disagree) to 5 (Strongly Agree)
        const question = QUESTIONS[currentQuestion];
        setScores(prev => ({
            ...prev,
            [question.gift]: (prev[question.gift] || 0) + value
        }));

        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            calculateResult();
        }
    };

    const calculateResult = async () => {
        setLoading(true);
        // Sort gifts by score
        const entries = Object.entries(scores);
        entries.sort((a, b) => b[1] - a[1]);

        const topGifts = entries.slice(0, 3).map(e => e[0]);
        setResult(topGifts);

        // Save to DB
        if (user) {
            try {
                await setDoc(doc(db, COLLECTIONS.ASSESSMENTS, user.uid), {
                    userId: user.uid,
                    type: 'spiritual_gifts',
                    scores: scores,
                    topGifts: topGifts,
                    completedAt: serverTimestamp()
                });
            } catch (error) {
                console.error("Error saving results:", error);
            }
        }
        setLoading(false);
    };

    if (!started) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center space-y-8 animate-fade-in">
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={48} />
                </div>
                <h1 className="text-4xl font-montserrat font-bold text-primary-blue">Discover Your Spiritual Gifts</h1>
                <p className="text-xl text-neutral-600 leading-relaxed">
                    God has equipped every believer with unique gifts to serve the body of Christ.
                    Take this short assessment to uncover how you are designed to make an impact.
                </p>
                <button
                    onClick={handleStart}
                    className="px-10 py-4 bg-primary text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                >
                    Start Assessment <ArrowRight />
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto py-24 flex flex-col items-center justify-center space-y-4 animate-fade-in">
                <Loader className="w-12 h-12 text-primary animate-spin" />
                <p className="text-xl text-neutral-600 font-medium">Analyzing your results...</p>
            </div>
        );
    }

    if (result.length > 0) {
        return (
            <div className="max-w-3xl mx-auto py-12 animate-fade-in">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-primary-blue mb-4">Your Spiritual Gifts Profile</h2>
                    <p className="text-neutral-500">Based on your responses, here are your primary gifts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {result.map((gift, index) => (
                        <div key={gift} className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-xl text-white ${index === 0 ? 'bg-accent-gold' : 'bg-primary'}`}>
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">{gift}</h3>
                            <p className="text-sm text-neutral-500">
                                {getGiftDescription(gift)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-neutral-50 p-8 rounded-2xl text-center space-y-4">
                    <h3 className="font-bold text-lg text-neutral-800">What's Next?</h3>
                    <p className="text-neutral-600">
                        Discuss your results with a pastor or join a ministry team that aligns with your gifts.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <button onClick={handleStart} className="flex items-center gap-2 text-neutral-500 hover:text-primary font-bold">
                            <RotateCcw size={18} /> Retake Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz View
    const progress = ((currentQuestion) / QUESTIONS.length) * 100;

    return (
        <div className="max-w-3xl mx-auto py-8 animate-fade-in">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-neutral-100 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-accent-teal transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-50 min-h-[400px] flex flex-col justify-center text-center">
                <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Question {currentQuestion + 1} of {QUESTIONS.length}</span>

                <h3 className="text-2xl md:text-3xl font-montserrat font-medium text-neutral-800 mb-12 leading-relaxed">
                    {QUESTIONS[currentQuestion].text}
                </h3>

                <div className="grid grid-cols-5 gap-2 md:gap-4">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button
                            key={val}
                            onClick={() => handleAnswer(val)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all
                                ${val === 5 ? 'border-primary text-primary hover:bg-primary hover:text-white' :
                                    val === 1 ? 'border-neutral-300 text-neutral-400 hover:border-red-400 hover:text-red-400' :
                                        'border-neutral-200 text-neutral-500 hover:border-primary/50 hover:text-primary'
                                }
                             `}>
                                {val}
                            </div>
                            <span className="text-xs text-neutral-400 font-medium hidden md:block group-hover:text-neutral-600">
                                {val === 1 ? 'Disagree' : val === 5 ? 'Agree' : ''}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="flex justify-between px-2 mt-2 text-xs font-bold text-neutral-300 md:hidden">
                    <span>Disagree</span>
                    <span>Agree</span>
                </div>
            </div>
        </div>
    );
}

function getGiftDescription(gift: string) {
    const descriptions: Record<string, string> = {
        'Prophecy': 'You have a keen sense of right and wrong and are not afraid to speak truth.',
        'Service': 'You show love by meeting practical needs and supporting others.',
        'Teaching': 'You have a passion for studying God’s Word and helping others understand it.',
        'Exhortation': 'You are a natural encourager who helps others reach their potential.',
        'Giving': 'You joyfully share your resources to advance God’s kingdom.',
        'Leadership': 'You can see the big picture and inspire others to follow.',
        'Mercy': 'You have deep empathy for those who are suffering and want to help.'
    };
    return descriptions[gift] || 'A unique ability to serve the body of Christ.';
}
