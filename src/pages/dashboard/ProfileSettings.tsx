import { useState, useEffect, useRef } from 'react';
import { FiUploadCloud, FiUser, FiCheck, FiEdit2, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, uploadProfileImage, getProfileImages } from '../../lib/api';
import type { Database } from '../../types/database.types';

type ProfileUpdate = Database['public']['Tables']['profile_studio']['Update'];

export default function ProfileSettings() {
  const { user, profile, refreshProfile } = useAuth();
  
  // View/Edit Mode State
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [bio, setBio] = useState('');
  const [primarySoftware, setPrimarySoftware] = useState('');
  const [kidAge, setKidAge] = useState('');
  const [interest, setInterest] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  const [yearsExperience, setYearsExperience] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  
  const [favoriteYoutuber, setFavoriteYoutuber] = useState('');
  const [equipmentUsed, setEquipmentUsed] = useState('');
  
  const [clinicName, setClinicName] = useState('');
  const [medicalLicense, setMedicalLicense] = useState('');
  const [yearsInPractice, setYearsInPractice] = useState('');

  // Metadata Fields
  // Creator
  const [equipmentList, setEquipmentList] = useState('');
  const [preferredVideoStyles, setPreferredVideoStyles] = useState('');
  const [availability, setAvailability] = useState('');
  // Kid
  const [favoriteGames, setFavoriteGames] = useState('');
  const [schoolGrade, setSchoolGrade] = useState('');
  const [dreamJob, setDreamJob] = useState('');
  // Doctor
  const [languagesSpoken, setLanguagesSpoken] = useState('');
  const [consultationHours, setConsultationHours] = useState('');
  const [medicalAssociation, setMedicalAssociation] = useState('');
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      if (!profile.onboarding_completed) {
        setIsEditing(true);
      }

      setFullName(profile.full_name || '');
      setPortfolioUrl(profile.portfolio_url || '');
      setBio(profile.bio || '');
      setPrimarySoftware(profile.primary_software || '');
      setKidAge(profile.kid_age?.toString() || '');
      setInterest(profile.interest || '');
      setParentEmail(profile.parent_email || '');
      
      setYearsExperience(profile.years_experience?.toString() || '');
      setYoutubeUrl(profile.youtube_url || '');
      setInstagramUrl(profile.instagram_url || '');
      
      setFavoriteYoutuber(profile.favorite_youtuber || '');
      setEquipmentUsed(profile.equipment_used || '');
      
      setClinicName(profile.clinic_name || '');
      setMedicalLicense(profile.medical_license || '');
      setYearsInPractice(profile.years_in_practice?.toString() || '');
      
      // Parse metadata
      let meta: any = {};
      try {
        if (profile.metadata) {
          meta = typeof profile.metadata === 'string' ? JSON.parse(profile.metadata) : profile.metadata;
        }
      } catch (e) {
        console.error("Failed to parse metadata", e);
      }
      
      setEquipmentList(meta.equipment_list || '');
      setPreferredVideoStyles(meta.preferred_video_styles || '');
      setAvailability(meta.availability || '');
      
      setFavoriteGames(meta.favorite_games || '');
      setSchoolGrade(meta.school_grade || '');
      setDreamJob(meta.dream_job || '');

      setLanguagesSpoken(meta.languages_spoken || '');
      setConsultationHours(meta.consultation_hours || '');
      setMedicalAssociation(meta.medical_association || '');

      // Fetch latest avatar
      if (user) {
        getProfileImages(user.id).then(images => {
          if (images && images.length > 0) {
            setAvatarUrl((images[0] as any).image_url);
          }
        }).catch(err => console.error("Error fetching avatar", err));
      }
    }
  }, [profile, user]);

  if (!profile || !user) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await uploadProfileImage(file, user.id);
      if (data) {
        setAvatarUrl(data.image_url);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      let metaDataObj: any = {};
      
      const updates: ProfileUpdate = {
        full_name: fullName,
        onboarding_completed: true,
      };

      if (profile.role === 'creator') {
        updates.portfolio_url = portfolioUrl;
        updates.bio = bio;
        updates.primary_software = primarySoftware;
        updates.years_experience = yearsExperience ? parseInt(yearsExperience, 10) : null;
        updates.youtube_url = youtubeUrl;
        updates.instagram_url = instagramUrl;
        
        metaDataObj = {
          equipment_list: equipmentList,
          preferred_video_styles: preferredVideoStyles,
          availability: availability
        };
      } else if (profile.role === 'kid') {
        updates.kid_age = kidAge ? parseInt(kidAge, 10) : null;
        updates.interest = interest;
        updates.parent_email = parentEmail;
        updates.favorite_youtuber = favoriteYoutuber;
        updates.equipment_used = equipmentUsed;
        
        metaDataObj = {
          favorite_games: favoriteGames,
          school_grade: schoolGrade,
          dream_job: dreamJob
        };
      } else if (profile.role === 'doctor') {
        updates.bio = bio;
        updates.clinic_name = clinicName;
        updates.medical_license = medicalLicense;
        updates.years_in_practice = yearsInPractice ? parseInt(yearsInPractice, 10) : null;
        
        metaDataObj = {
          languages_spoken: languagesSpoken,
          consultation_hours: consultationHours,
          medical_association: medicalAssociation
        };
      }
      
      updates.metadata = metaDataObj;

      await updateProfile(user.id, updates);
      await refreshProfile();
      setSuccess(true);
      setIsEditing(false); // return to view mode on success
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderViewField = (label: string, value: string | null | undefined) => {
    if (!value) return null;
    return (
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-slate-900 font-medium">{value}</p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">
            {profile.onboarding_completed ? 'Profile Settings' : 'Complete Your Profile'}
          </h1>
          <p className="text-slate-500">
            Manage your account details and profile information here.
          </p>
        </div>
        
        {profile.onboarding_completed && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-brand-red bg-brand-red/10 hover:bg-brand-red/20 transition-all"
          >
            <FiEdit2 /> Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-brand-red rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
              <FiCheck className="text-lg" /> Profile updated successfully!
            </div>
          )}
          
          {/* View Mode */}
          {!isEditing && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                  {avatarUrl ? (
                     <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                     <FiUser className="text-4xl text-slate-300" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{profile.full_name}</h2>
                  <p className="text-slate-500 capitalize font-medium">{profile.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {renderViewField("Email Address", profile.email)}
                
                {profile.role === 'creator' && (
                  <>
                    {renderViewField("Portfolio / Website URL", profile.portfolio_url)}
                    {renderViewField("Primary Software", profile.primary_software)}
                    {renderViewField("Years of Experience", profile.years_experience?.toString())}
                    {renderViewField("YouTube URL", profile.youtube_url)}
                    {renderViewField("Instagram URL", profile.instagram_url)}
                    
                    {renderViewField("Equipment List", equipmentList)}
                    {renderViewField("Preferred Video Styles", preferredVideoStyles)}
                    {renderViewField("Availability", availability)}
                  </>
                )}
                
                {profile.role === 'kid' && (
                  <>
                    {renderViewField("Age", profile.kid_age?.toString())}
                    {renderViewField("Main Interest", profile.interest)}
                    {renderViewField("Parent/Guardian Email", profile.parent_email)}
                    {renderViewField("Favorite YouTuber", profile.favorite_youtuber)}
                    {renderViewField("Equipment Used", profile.equipment_used)}
                    
                    {renderViewField("Favorite Games", favoriteGames)}
                    {renderViewField("School Grade", schoolGrade)}
                    {renderViewField("Dream Job", dreamJob)}
                  </>
                )}
                
                {profile.role === 'doctor' && (
                  <>
                    {renderViewField("Clinic / Hospital Name", profile.clinic_name)}
                    {renderViewField("Medical License Number", profile.medical_license)}
                    {renderViewField("Years in Practice", profile.years_in_practice?.toString())}
                    
                    {renderViewField("Languages Spoken", languagesSpoken)}
                    {renderViewField("Consultation Hours", consultationHours)}
                    {renderViewField("Medical Association Memberships", medicalAssociation)}
                  </>
                )}
              </div>
              
              {(profile.role === 'creator' || profile.role === 'doctor') && profile.bio && (
                 <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {profile.role === 'doctor' ? 'Specialty & Background' : 'Bio / Experience'}
                    </p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                 </div>
              )}
            </div>
          )}

          {/* Edit Mode Form */}
          {isEditing && (
            <form id="profile-form" onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
              
              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                    {avatarUrl ? (
                       <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                       <FiUser className="text-5xl text-slate-300" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiUploadCloud className="text-white text-2xl" />
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left mt-2">
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Profile Picture</h3>
                  <p className="text-sm text-slate-500 mb-4">Upload a square image (JPG, PNG). Minimum size 200x200px.</p>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm font-semibold text-brand-red bg-brand-red/10 px-5 py-2.5 rounded-lg hover:bg-brand-red/20 transition-colors"
                  >
                    {avatarUrl ? 'Change Image' : 'Upload Image'}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Global Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-100">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-2">Email address cannot be changed.</p>
                </div>
              </div>

              {/* Role Specific Fields */}
              {profile.role === 'creator' && (
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg">Creator Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Portfolio / Website URL</label>
                      <input 
                        type="url" 
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://yourportfolio.com"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Primary Software</label>
                      <input 
                        type="text" 
                        value={primarySoftware}
                        onChange={(e) => setPrimarySoftware(e.target.value)}
                        placeholder="e.g. Adobe Premiere, After Effects"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Years of Experience</label>
                      <input 
                        type="number" 
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">YouTube Channel URL</label>
                      <input 
                        type="url" 
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/c/yourchannel"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Instagram URL</label>
                      <input 
                        type="url" 
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="https://instagram.com/yourhandle"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Availability</label>
                      <input 
                        type="text" 
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        placeholder="e.g. Full-time, Part-time, Freelance"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Equipment List</label>
                      <input 
                        type="text" 
                        value={equipmentList}
                        onChange={(e) => setEquipmentList(e.target.value)}
                        placeholder="e.g. Sony A7III, Rode Mic"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Video Styles</label>
                      <input 
                        type="text" 
                        value={preferredVideoStyles}
                        onChange={(e) => setPreferredVideoStyles(e.target.value)}
                        placeholder="e.g. Vlogs, Gaming, Documentary"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Bio / Experience</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Tell us a bit about your editing experience..."
                      className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {profile.role === 'kid' && (
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg">Young Creator Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
                      <input 
                        type="number" 
                        value={kidAge}
                        onChange={(e) => setKidAge(e.target.value)}
                        placeholder="e.g. 12"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5E00]/20 focus:border-[#FF5E00] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Main Interest</label>
                      <input 
                        type="text" 
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        placeholder="e.g. Gaming, Vlogs"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5E00]/20 focus:border-[#FF5E00] transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Favorite YouTuber</label>
                      <input 
                        type="text" 
                        value={favoriteYoutuber}
                        onChange={(e) => setFavoriteYoutuber(e.target.value)}
                        placeholder="e.g. MrBeast, Ryan's World"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5E00]/20 focus:border-[#FF5E00] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Equipment Used</label>
                      <input 
                        type="text" 
                        value={equipmentUsed}
                        onChange={(e) => setEquipmentUsed(e.target.value)}
                        placeholder="e.g. iPad, Smartphone, PC"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5E00]/20 focus:border-[#FF5E00] transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Favorite Games</label>
                      <input 
                        type="text" 
                        value={favoriteGames}
                        onChange={(e) => setFavoriteGames(e.target.value)}
                        placeholder="e.g. Roblox, Minecraft"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5E00]/20 focus:border-[#FF5E00] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">School Grade</label>
                      <input 
                        type="text" 
                        value={schoolGrade}
                        onChange={(e) => setSchoolGrade(e.target.value)}
                        placeholder="e.g. 5th Grade"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5E00]/20 focus:border-[#FF5E00] transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Dream Job</label>
                      <input 
                        type="text" 
                        value={dreamJob}
                        onChange={(e) => setDreamJob(e.target.value)}
                        placeholder="e.g. Professional Gamer"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5E00]/20 focus:border-[#FF5E00] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Parent/Guardian Email</label>
                      <input 
                        type="email" 
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5E00]/20 focus:border-[#FF5E00] transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {profile.role === 'doctor' && (
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-900 text-lg">Professional Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Clinic / Hospital Name</label>
                      <input 
                        type="text" 
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        placeholder="e.g. City General Hospital"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Years in Practice</label>
                      <input 
                        type="number" 
                        value={yearsInPractice}
                        onChange={(e) => setYearsInPractice(e.target.value)}
                        placeholder="e.g. 10"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Medical License Number (Optional)</label>
                      <input 
                        type="text" 
                        value={medicalLicense}
                        onChange={(e) => setMedicalLicense(e.target.value)}
                        placeholder="e.g. MD12345678"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Languages Spoken</label>
                      <input 
                        type="text" 
                        value={languagesSpoken}
                        onChange={(e) => setLanguagesSpoken(e.target.value)}
                        placeholder="e.g. English, Spanish"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Consultation Hours</label>
                      <input 
                        type="text" 
                        value={consultationHours}
                        onChange={(e) => setConsultationHours(e.target.value)}
                        placeholder="e.g. Mon-Fri 9AM-5PM"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Medical Association</label>
                      <input 
                        type="text" 
                        value={medicalAssociation}
                        onChange={(e) => setMedicalAssociation(e.target.value)}
                        placeholder="e.g. American Medical Association"
                        className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Specialty & Background Info</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="e.g. Pediatrician focusing on child nutrition and care..."
                      className="w-full px-4 py-3 bg-[#F7F9FC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                {profile.onboarding_completed && (
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-6 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl shadow-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                )}
                
                <button 
                  type="submit"
                  disabled={isSaving}
                  className={`px-8 py-3 font-bold text-white rounded-xl shadow-md transition-colors flex items-center gap-2
                    ${profile.role === 'kid' ? 'bg-[#FF5E00] hover:bg-[#E65500]' : 
                      profile.role === 'doctor' ? 'bg-teal-600 hover:bg-teal-700' : 
                      'bg-brand-red hover:bg-[#E0205C]'}
                    ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
