import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function LikeButton() {
    const [likes, setLikes] = useState(0);
    const [isLiking, setIsLiking] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);

    // 컴포넌트 마운트 시 초기 좋아요 수 불러오기
    useEffect(() => {
        fetchLikes();
        const hitStatus = localStorage.getItem('has_hit_portfolio');
        if (hitStatus === 'true') {
            setHasLiked(true);
        }
    }, []);

    const fetchLikes = async () => {
        try {
            const { data, error } = await supabase
                .from('portfolio_stats')
                .select('likes')
                .eq('id', 1)
                .single();

            if (error) throw error;
            if (data) setLikes(data.likes);
        } catch (error) {
            console.error('Failed to fetch likes:', error);
        }
    };

    const handleLike = async () => {
        if (isLiking || hasLiked) return;
        setIsLiking(true);

        try {
            // 현재 DB 값 가져오기 (동시성 처리)
            const { data: currentData } = await supabase.from('portfolio_stats').select('likes').eq('id', 1).single();
            const currentLikes = currentData ? currentData.likes : likes;

            // 숫자 1 증가
            const { data, error } = await supabase
                .from('portfolio_stats')
                .update({ likes: currentLikes + 1 })
                .eq('id', 1)
                .select()
                .single();

            if (error) throw error;

            setLikes(data.likes);
            setHasLiked(true);
            localStorage.setItem('has_hit_portfolio', 'true');

            // 약간의 애니메이션 효과 트리거를 위해 잠깐 대기 가능
        } catch (error) {
            console.error('Failed to update likes:', error);
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLiking || hasLiked}
            className={`absolute -bottom-4 -right-4 z-10 flex flex-row items-center justify-center gap-2 px-4 py-2 border-2 border-black font-black shadow-[4px_4px_0px_#000] transition-all rounded-md
        ${hasLiked ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-[2px_2px_0px_#000] translate-x-[2px] translate-y-[2px]' : 'bg-[#87CEEB] text-[#1a202c] hover:bg-[#7bc0dd] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000]'}
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`}
            style={{ fontFamily: "'Nanum Pen Script', cursive, sans-serif" }}
        >
            <span className="text-lg tracking-widest leading-none font-sans pt-0.5">HIT!</span>
            <span className="text-xl font-sans tracking-tight leading-none pt-0.5">{likes}</span>
        </button>
    );
}
