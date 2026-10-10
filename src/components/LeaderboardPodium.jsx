import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  Zap, 
  Flame, 
  Users, 
  School, 
  Sparkles, 
  ChevronDown,
  Award,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export const LeaderboardPodium = () => {
  const { students = [], groups = [], currentStudent, lang } = useApp();

  // تصفية حسب المجموعة أو كل المنصة
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');

  // حساب ترتيب الطلاب وترتيبهم بناءً على درجاتهم وإنجازاتهم
  const rankedStudents = useMemo(() => {
    let list = students.filter(s => s.status === 'approved');

    if (selectedGroupFilter !== 'all') {
      list = list.filter(s => s.groupId === selectedGroupFilter);
    }

    // حساب الدرجة الإجمالية المركبة: (XP + النجوم * 15 + الفقرات المكتملة * 25)
    return list
      .map(std => {
        const completedCount = std.completedChunks?.length || 0;
        const totalCompositeScore = (std.xp || 0) + ((std.stars || 0) * 15) + (completedCount * 25);
        const group = groups.find(g => g.id === std.groupId);

        return {
          ...std,
          totalScore: totalCompositeScore,
          groupName: group ? group.name : (lang === 'en' ? 'General' : 'عام'),
          groupColor: group?.color || '#6366f1',
          completedCount
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [students, groups, selectedGroupFilter, lang]);

  // الأوائل الثلاثة
  const firstPlace = rankedStudents[0] || null;
  const secondPlace = rankedStudents[1] || null;
  const thirdPlace = rankedStudents[2] || null;
  const remainingStudents = rankedStudents.slice(3);

  return (
    <div className="leaderboard-podium-wrapper">
      {/* رأس قسم مدرج الأوائل */}
      <div className="leaderboard-header-section">
        <div className="leaderboard-title-group">
          <div className="podium-trophy-badge">
            <Trophy size={28} className="text-amber-400" />
            <Sparkles size={16} className="trophy-sparkle-icon" />
          </div>
          <div>
            <h2 className="podium-main-heading">
              {lang === 'en' ? 'Champions Podium & Hall of Fame' : 'مدرج الأوائل ولوحة شرف المتفوقين'}
            </h2>
            <p className="podium-subheading">
              {lang === 'en' 
                ? 'Dynamic ranking based on verified quiz scores, topic mastery, and daily streaks.'
                : 'ترتيب تنافسي ذكي يُحسب تلقائياً بناءً على نقاط الخبرة XP، النجوم المكتسبة، والفقرات المتقنة.'
              }
            </p>
          </div>
        </div>

        {/* فلاتر المجموعات الدراسية */}
        <div className="podium-group-filters">
          <button 
            className={`podium-filter-chip ${selectedGroupFilter === 'all' ? 'active' : ''}`}
            onClick={() => {
              setSelectedGroupFilter('all');
              playSound.click();
            }}
          >
            <Users size={15} />
            <span>{lang === 'en' ? 'All Platform' : 'كل المنصة (العام)'}</span>
          </button>

          {groups.map(group => (
            <button 
              key={group.id}
              className={`podium-filter-chip ${selectedGroupFilter === group.id ? 'active' : ''}`}
              style={{
                borderColor: selectedGroupFilter === group.id ? group.color : undefined
              }}
              onClick={() => {
                setSelectedGroupFilter(group.id);
                playSound.click();
              }}
            >
              <School size={15} />
              <span>{group.name.split('-')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* المدرج الثلاثي (الذهبي في المنتصف، الفضي والبرونزي على الجانبين) */}
      <div className="podium-stage-container">
        {/* المركز الثاني: الفضي (على اليمين في العربي) */}
        {secondPlace ? (
          <div className="podium-slot rank-silver">
            <div className="podium-student-card">
              <div className="podium-avatar-wrap silver-glow">
                <img src={secondPlace.avatar} alt={secondPlace.name} className="podium-avatar" />
                <div className="podium-medal-badge silver-medal">
                  <span>🥈</span>
                </div>
              </div>
              <h3 className="podium-student-name">{secondPlace.name}</h3>
              <span className="podium-group-tag" style={{ color: secondPlace.groupColor }}>
                {secondPlace.groupName}
              </span>
              <div className="podium-score-pill">
                <Zap size={13} className="text-indigo-400" />
                <span>{secondPlace.xp} XP</span>
                <span className="dot-sep">•</span>
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span>{secondPlace.stars}</span>
              </div>
            </div>
            {/* عمود المدرج الفضي */}
            <div className="podium-pillar pillar-silver">
              <span className="pillar-rank-num">2</span>
              <span className="pillar-rank-label">{lang === 'en' ? 'Silver' : 'فضي'}</span>
            </div>
          </div>
        ) : (
          <div className="podium-slot rank-silver is-empty-placeholder">
            <div className="podium-student-card">
              <div className="podium-avatar-wrap silver-glow">
                <div className="podium-avatar empty-avatar-box">🥈</div>
              </div>
              <h3 className="podium-student-name empty-name">{lang === 'en' ? 'Available' : 'متاح للتنافس'}</h3>
              <span className="podium-group-tag empty-tag">{lang === 'en' ? 'Rank 2' : 'المركز الثاني'}</span>
            </div>
            <div className="podium-pillar pillar-silver">
              <span className="pillar-rank-num">2</span>
              <span className="pillar-rank-label">{lang === 'en' ? 'Silver' : 'فضي'}</span>
            </div>
          </div>
        )}

        {/* المركز الأول: الذهبي في المنتصف (الأعلى والأبهى) */}
        {firstPlace ? (
          <div className="podium-slot rank-gold is-champion">
            <div className="podium-crown-aura">
              <Crown size={30} className="podium-crown-icon" />
            </div>
            <div className="podium-student-card champion-card">
              <div className="podium-avatar-wrap gold-glow">
                <img src={firstPlace.avatar} alt={firstPlace.name} className="podium-avatar champion-avatar" />
                <div className="podium-medal-badge gold-medal">
                  <span>🥇</span>
                </div>
              </div>
              <h3 className="podium-student-name champion-name">{firstPlace.name}</h3>
              <span className="podium-group-tag" style={{ color: firstPlace.groupColor }}>
                {firstPlace.groupName}
              </span>
              <div className="podium-score-pill champion-score-pill">
                <Zap size={14} className="text-amber-300" />
                <span className="font-extrabold">{firstPlace.xp} XP</span>
                <span className="dot-sep">•</span>
                <Star size={14} className="text-amber-300 fill-amber-300" />
                <span className="font-extrabold">{firstPlace.stars}</span>
              </div>
              <div className="champion-ribbon">
                <span>🏆 {lang === 'en' ? 'Leader of the Pack' : 'متصدر الدفعة'}</span>
              </div>
            </div>
            {/* عمود المدرج الذهبي الأعلى */}
            <div className="podium-pillar pillar-gold">
              <span className="pillar-rank-num">1</span>
              <span className="pillar-rank-label">{lang === 'en' ? 'Gold Champion' : 'المركز الذهبي'}</span>
            </div>
          </div>
        ) : (
          <div className="podium-slot rank-gold is-champion is-empty-placeholder">
            <div className="podium-crown-aura">
              <Crown size={30} className="podium-crown-icon" />
            </div>
            <div className="podium-student-card champion-card">
              <div className="podium-avatar-wrap gold-glow">
                <div className="podium-avatar champion-avatar empty-avatar-box">🥇</div>
              </div>
              <h3 className="podium-student-name champion-name empty-name">{lang === 'en' ? 'Top Spot' : 'قمة المدرج'}</h3>
              <span className="podium-group-tag empty-tag">{lang === 'en' ? 'Rank 1' : 'المركز الأول'}</span>
            </div>
            <div className="podium-pillar pillar-gold">
              <span className="pillar-rank-num">1</span>
              <span className="pillar-rank-label">{lang === 'en' ? 'Gold Champion' : 'المركز الذهبي'}</span>
            </div>
          </div>
        )}

        {/* المركز الثالث: البرونزي */}
        {thirdPlace ? (
          <div className="podium-slot rank-bronze">
            <div className="podium-student-card">
              <div className="podium-avatar-wrap bronze-glow">
                <img src={thirdPlace.avatar} alt={thirdPlace.name} className="podium-avatar" />
                <div className="podium-medal-badge bronze-medal">
                  <span>🥉</span>
                </div>
              </div>
              <h3 className="podium-student-name">{thirdPlace.name}</h3>
              <span className="podium-group-tag" style={{ color: thirdPlace.groupColor }}>
                {thirdPlace.groupName}
              </span>
              <div className="podium-score-pill">
                <Zap size={13} className="text-amber-600" />
                <span>{thirdPlace.xp} XP</span>
                <span className="dot-sep">•</span>
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span>{thirdPlace.stars}</span>
              </div>
            </div>
            {/* عمود المدرج البرونزي */}
            <div className="podium-pillar pillar-bronze">
              <span className="pillar-rank-num">3</span>
              <span className="pillar-rank-label">{lang === 'en' ? 'Bronze' : 'برونزي'}</span>
            </div>
          </div>
        ) : (
          <div className="podium-slot rank-bronze is-empty-placeholder">
            <div className="podium-student-card">
              <div className="podium-avatar-wrap bronze-glow">
                <div className="podium-avatar empty-avatar-box">🥉</div>
              </div>
              <h3 className="podium-student-name empty-name">{lang === 'en' ? 'Available' : 'متاح للتنافس'}</h3>
              <span className="podium-group-tag empty-tag">{lang === 'en' ? 'Rank 3' : 'المركز الثالث'}</span>
            </div>
            <div className="podium-pillar pillar-bronze">
              <span className="pillar-rank-num">3</span>
              <span className="pillar-rank-label">{lang === 'en' ? 'Bronze' : 'برونزي'}</span>
            </div>
          </div>
        )}
      </div>

      {rankedStudents.length === 0 && (
        <div className="podium-empty-callout">
          <Sparkles size={20} className="text-amber-400" />
          <span>
            {lang === 'en' 
              ? 'The podium is ready! Be the first hero to start learning and claim the #1 rank!' 
              : 'المدرج جاهز للأبطال! سجل الآن وابدأ المذاكرة لتكون أول من يعتلي قمة المدرج! 🚀'}
          </span>
        </div>
      )}

      {/* قائمة باقي المتفوقين في الترتيب (المركز الرابع فما بعد) */}
      {remainingStudents.length > 0 && (
        <div className="leaderboard-runners-table">
          <div className="runners-table-header">
            <span>{lang === 'en' ? 'Rank & Student' : 'الترتيب والطالب'}</span>
            <span>{lang === 'en' ? 'Group' : 'المجموعة الدراسية'}</span>
            <span>{lang === 'en' ? 'Mastery Score' : 'مجموع النقاط والإتقان'}</span>
          </div>

          <div className="runners-list">
            {remainingStudents.map((std, idx) => {
              const rankNum = idx + 4;
              const isCurrentUser = currentStudent && currentStudent.id === std.id;

              return (
                <div 
                  key={std.id} 
                  className={`runner-row-item ${isCurrentUser ? 'is-current-user-row' : ''}`}
                >
                  <div className="runner-profile-cell">
                    <span className="runner-rank-badge">#{rankNum}</span>
                    <img src={std.avatar} alt={std.name} className="runner-avatar" />
                    <div>
                      <span className="runner-name">{std.name}</span>
                      {isCurrentUser && (
                        <span className="current-user-tag">
                          {lang === 'en' ? '(You)' : '(حسابك)'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="runner-group-cell">
                    <span className="runner-group-badge" style={{ borderColor: std.groupColor }}>
                      {std.groupName}
                    </span>
                  </div>

                  <div className="runner-score-cell">
                    <div className="runner-stats-flex">
                      <span className="stat-item xp-item" title="XP">
                        <Zap size={14} className="text-indigo-400" />
                        {std.xp}
                      </span>
                      <span className="stat-item star-item" title="Stars">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        {std.stars}
                      </span>
                      <span className="stat-item topics-item" title="Completed Topics">
                        <Award size={14} className="text-emerald-400" />
                        {std.completedCount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPodium;
