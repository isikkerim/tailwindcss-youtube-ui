// Sample video data with realistic Turkish content
const videoTitles = [
    "Türkiye'nin En Güzel 10 Antik Kenti | Tarih Rotası",
    "Esnafın 50 Yıllık Değişmeyen Kahvaltı Ritüeli | Sokak Lezzetleri",
    "İstanbul'un En İyi 5 Sahaf Dükkanı | Kitap Rotası",
    "Karadeniz Yaylalarında Bir Gün | Doğa ve Yaşam",
    "Anadolu'nun Son Bakır Ustaları | Zanaat Hikayeleri",
    "Kadim Şehir Mardin'in Sokakları | Gezi Rehberi",
    "Türk Kahvesinin 500 Yıllık Serüveni | Belgesel",
    "Boğaz'ın Balıkçıları | Mini Belgesel",
    "Antep Mutfağının Sırları | Gastronomi",
    "İzmir'in Efsane Sokak Tatları | Lezzet Durağı",
    "Kapalıçarşı'nın Bilinmeyen Hikayeleri | Tarih",
    "Anadolu'nun Kayıp Lezzetleri | Mutfak Kültürü",
    "Van Kahvaltısının Püf Noktaları | Gurme Rehberi",
    "Hatay Mutfağının Unutulmaz Tatları | Yemek Rotası",
    "Safranbolu'nun Tarihi Konakları | Mimari"
];

const channelNames = [
    "Lezzet Durağı TV",
    "Anadolu Şefi",
    "Mutfak Hikayeleri",
    "Sokak Rotası",
    "Gezi Günlüğü",
    "Tadım Ustası",
    "Kültür Keşifleri",
    "Gurme Noktası",
    "Şehir Rehberi",
    "Yemek Atölyesi",
    "Gezi Pusulası",
    "Tat Akademisi",
    "Mutfak Sırları",
    "Anadolu Lezzetleri",
    "Gastronomi Dünyası"
];

const videoData = Array.from({ length: 50 }, (_, i) => {
    const randomTitle = videoTitles[Math.floor(Math.random() * videoTitles.length)];
    const randomChannel = channelNames[Math.floor(Math.random() * channelNames.length)];
    const randomViews = Math.floor(Math.random() * 999) + (Math.random() > 0.5 ? 'B' : 'M');
    const randomDays = Math.floor(Math.random() * 30);
    const randomDuration = `${Math.floor(Math.random() * 20) + 5}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`;
    
    return {
        id: i + 1,
        // Using Picsum Photos for reliable image loading
        thumbnail: `https://picsum.photos/640/360?random=${i + 100}`,
        title: `${randomTitle}`,
        // Using Picsum Photos for profile pictures
        channelAvatar: `https://picsum.photos/96/96?random=${i + 200}`,
        channelName: randomChannel,
        views: randomViews,
        uploadTime: `${randomDays} gün önce`,
        duration: randomDuration,
        verified: Math.random() > 0.5 // More channels verified
    };
});

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Setup sidebar toggle functionality
    const menuButton = document.querySelector('.fa-bars').parentElement;
    const sidebar = document.querySelector('aside');
    const mainContent = document.querySelector('main');

    // Toggle sidebar visibility
    menuButton.addEventListener('click', () => {
        if (window.innerWidth >= 768) {
            sidebar.classList.toggle('-translate-x-full');
            mainContent.classList.toggle('md:ml-64');
            mainContent.classList.toggle('ml-0');
        } else {
            sidebar.classList.toggle('hidden');
        }
    });

    // Handle responsive sidebar behavior
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('hidden');
            sidebar.classList.remove('-translate-x-full');
            mainContent.classList.add('md:ml-64');
        } else {
            sidebar.classList.add('hidden');
            mainContent.classList.remove('md:ml-64');
        }
    });

    // Start lazy loading implementation
    initializeLazyLoading();
});

// Create HTML for a video card with verified badge
function createVideoCard(video) {
    return `
        <article class="video-card group">
            <a href="video.html" class="block relative">
                <!-- Thumbnail container -->
                <div class="relative">
                    <img 
                        src="${video.thumbnail}" 
                        alt="Video thumbnail" 
                        class="w-full aspect-video object-cover rounded-xl"
                        loading="lazy"
                    >
                    <!-- Video duration badge -->
                    <span class="absolute bottom-1 right-1 bg-black/80 px-2 py-1 text-xs rounded-md text-white">
                        ${video.duration}
                    </span>
                    <!-- Hover overlay with play button -->
                    <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button class="bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all text-white">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <!-- Video info section -->
                <div class="p-3">
                    <div class="flex">
                        <!-- Channel avatar -->
                        <img 
                            src="${video.channelAvatar}" 
                            alt="Channel avatar" 
                            class="w-10 h-10 rounded-full"
                            loading="lazy"
                        >
                        <div class="ml-3 flex-1">
                            <!-- Video title -->
                            <h3 class="font-medium text-gray-900 line-clamp-2">${video.title}</h3>
                            <!-- Channel name with verified badge -->
                            <p class="text-gray-600 text-sm mt-1 flex items-center">
                                ${video.channelName}
                                ${video.verified ? `<i class="fas fa-check-circle text-gray-600 ml-1 text-xs"></i>` : ''}
                            </p>
                            <!-- View count and upload time -->
                            <p class="text-gray-600 text-sm">${video.views} görüntüleme • ${video.uploadTime}</p>
                        </div>
                        <!-- Options button -->
                        <button class="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-full transition-all text-gray-600">
                            <i class="fas fa-ellipsis-vertical"></i>
                        </button>
                    </div>
                </div>
            </a>
        </article>
    `;
}

// Initialize lazy loading functionality
function initializeLazyLoading() {
    const videoGrid = document.getElementById('video-grid');
    const loadingIndicator = document.getElementById('loading');
    let currentIndex = 0;
    const itemsPerLoad = 8;

    // Load more videos function
    function loadMoreVideos() {
        loadingIndicator.classList.remove('hidden');
        
        // Simulate network delay
        setTimeout(() => {
            const fragment = document.createDocumentFragment();
            const endIndex = Math.min(currentIndex + itemsPerLoad, videoData.length);
            
            // Create and append new video cards
            for (let i = currentIndex; i < endIndex; i++) {
                const videoCardHTML = createVideoCard(videoData[i]);
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = videoCardHTML;
                fragment.appendChild(tempContainer.firstElementChild);
            }
            
            videoGrid.appendChild(fragment);
            currentIndex = endIndex;
            loadingIndicator.classList.add('hidden');
            
            // Stop observing if all videos are loaded
            if (currentIndex >= videoData.length) {
                observer.disconnect();
            }
        }, 500);
    }

    // Setup Intersection Observer for infinite scroll
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentIndex < videoData.length) {
            loadMoreVideos();
        }
    }, { threshold: 0.1 });

    observer.observe(loadingIndicator);

    // Load initial set of videos
    loadMoreVideos();
}

// Handle category button clicks
document.querySelectorAll('button').forEach(button => {
    if (!button.querySelector('i')) { // Only for category buttons
        button.addEventListener('click', function() {
            // Reset all buttons to default state
            document.querySelectorAll('button').forEach(btn => {
                if (!btn.querySelector('i')) {
                    btn.classList.remove('bg-black', 'text-white');
                    btn.classList.add('bg-gray-100', 'text-gray-900');
                }
            });
            // Set active state for clicked button
            this.classList.remove('bg-gray-100', 'text-gray-900');
            this.classList.add('bg-black', 'text-white');
        });
    }
});

// Like/Dislike functionality
const likeButtons = document.querySelectorAll('.fa-thumbs-up, .fa-thumbs-down').forEach(button => {
    button.parentElement.addEventListener('click', function() {
        this.classList.toggle('text-youtube-red');
    });
});

// Subscribe button functionality
const subscribeButton = document.querySelector('.btn-primary');
if (subscribeButton) {
    subscribeButton.addEventListener('click', function() {
        this.textContent = this.textContent === 'Abone Ol' ? 'Abone Olundu' : 'Abone Ol';
        this.classList.toggle('bg-gray-600');
    });
}

// Comment input functionality
const commentInput = document.querySelector('input[placeholder="Yorum ekle..."]');
if (commentInput) {
    commentInput.addEventListener('focus', function() {
        this.parentElement.classList.add('border-blue-500');
    });

    commentInput.addEventListener('blur', function() {
        this.parentElement.classList.remove('border-blue-500');
    });
} 