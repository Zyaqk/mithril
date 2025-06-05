document.addEventListener("DOMContentLoaded", function () {
    const guidesList = document.querySelector(".guidesList.containerGuides");
    const guidesListRPG = document.querySelector(".guidesListRPG.containerGuides");
    const guidesListArenaLegends = document.querySelector(".guidesListArenaLegends.containerGuides");
    const guidRPG = document.getElementById("guidRPG");
    const guidArenaLegend = document.getElementById("guidArenaLegend");

    function fadeOut(element, callback) {
        if (!element) return;
        element.style.transition = "opacity 0.5s";
        element.style.opacity = "0";
        setTimeout(() => {
            element.style.display = "none";
            if (callback) callback();
        }, 500);
    }
    function fadeIn(element) {
        if (!element) return;
        element.style.display = "grid";
        element.style.opacity = "0";
        setTimeout(() => {
            element.style.transition = "opacity 0.5s";
            element.style.opacity = "1";
        }, 10);
    }

    if (guidRPG && guidesList && guidesListRPG) {
        guidRPG.addEventListener("click", function () {
            fadeOut(guidesList, function() {
                fadeIn(guidesListRPG);
            });
        });
    }
    if (guidArenaLegend && guidesList && guidesListArenaLegends) {
        guidArenaLegend.addEventListener("click", function () {
            fadeOut(guidesList, function() {
                fadeIn(guidesListArenaLegends);
            });
        });
    }

    document.querySelectorAll('.closeGuidRPGBtn').forEach(function(btn) {
        btn.addEventListener("click", function() {
            fadeOut(guidesListRPG, function() {
                fadeIn(guidesList);
            });
        });
    });
    document.querySelectorAll('.closeGuidArenaLegendsBtn').forEach(function(btn) {
        btn.addEventListener("click", function() {
            fadeOut(guidesListArenaLegends, function() {
                fadeIn(guidesList);
            });
        });
    });

    
    const guidI = document.getElementById("guidI");
    const guidII = document.getElementById("guidII");
    const guidIII = document.getElementById("guidIII");
    const descriptionGuidI = document.getElementById("descriptionGuidI");
    const descriptionGuidII = document.getElementById("descriptionGuidII");
    const descriptionGuidIII = document.getElementById("descriptionGuidIII");

    if (guidI && descriptionGuidI && guidesListRPG) {
        guidI.addEventListener("click", function () {
            fadeOut(guidesListRPG, function() {
                fadeIn(descriptionGuidI);
                document.querySelector(".guidesDescription").style.display = 'block';
            });
        });
    }



    if (guidII && descriptionGuidII && guidesListRPG) {
        guidII.addEventListener("click", function () {
            fadeOut(guidesListRPG, function() {
                fadeIn(descriptionGuidII);
                document.querySelector(".guidesDescription").style.display = 'block';
            });
        });
    }

    if (guidIII && descriptionGuidIII && guidesListRPG) {
        guidIII.addEventListener("click", function () {
            fadeOut(guidesListRPG, function() {
                fadeIn(descriptionGuidIII);
                document.querySelector(".guidesDescription").style.display = 'block';
            });
        });
    }


    document.querySelectorAll('.closeGuidBtn').forEach(function(btn){
    btn.addEventListener("click", function() {
        const desc = btn.closest('.guideDescription');
        if (desc) {
            fadeOut(desc, function() {
                fadeIn(guidesListRPG);
                document.querySelector(".guidesDescription").style.display = 'none';
            });
        }
    });
});
});
