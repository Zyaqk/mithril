document.addEventListener("DOMContentLoaded", function () {
    const guidI = document.getElementById("guidI");
    const closeGuid = document.getElementById("closeGuid");
    const guidesList = document.querySelector(".guidesList");
    const guidesDescription = document.querySelector(".guidesDescription");
    
    const descriptions = [
        document.getElementById("descriptionGuidI"),
        document.getElementById("descriptionGuidII"),
        document.getElementById("descriptionGuidIII")
    ];

    guidI.addEventListener("click", function () {
        guidesList.style.transition = "opacity 0.5s ease-out";
        guidesList.style.opacity = "0";
        setTimeout(() => {
            guidesList.style.display = "none";
            guidesDescription.style.display = "block";
            descriptions.forEach(desc => {
                if (desc) {
                    desc.style.display = "block";
                    desc.style.opacity = "0";
                }
            });
            setTimeout(() => {
                guidesDescription.style.transition = "opacity 0.5s ease-in";
                guidesDescription.style.opacity = "1";
                descriptions.forEach(desc => {
                    if (desc) desc.style.opacity = "1";
                });
            }, 50);
        }, 500);
    });

    closeGuid.addEventListener("click", function () {
        let visibleDescriptions = descriptions.filter(desc => desc && desc.style.display === "block");
        if (visibleDescriptions.length > 0) {
            visibleDescriptions.forEach(desc => {
                desc.style.transition = "opacity 0.5s ease-out";
                desc.style.opacity = "0";
            });
            setTimeout(() => {
                visibleDescriptions.forEach(desc => desc.style.display = "none");
                guidesList.style.display = "grid";
                guidesList.style.opacity = "0";
                setTimeout(() => {
                    guidesList.style.transition = "opacity 0.5s ease-in";
                    guidesList.style.opacity = "1";
                }, 50);
            }, 500);
        }
    });
});