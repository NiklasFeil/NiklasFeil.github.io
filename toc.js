// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="about_me.html">About me</a></li><li class="chapter-item expanded "><a href="IARVR.html"><strong aria-hidden="true">1.</strong> IARVR - Witchcraft and Wizardry</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="#introduction.html"><strong aria-hidden="true">1.1.</strong> Introduction</a></li><li class="chapter-item expanded "><a href="#project-goal.html"><strong aria-hidden="true">1.2.</strong> Project goal</a></li><li class="chapter-item expanded "><a href="#project-setup.html"><strong aria-hidden="true">1.3.</strong> Project setup</a></li><li class="chapter-item expanded "><a href="#motivation.html"><strong aria-hidden="true">1.4.</strong> Motivation</a></li><li class="chapter-item expanded "><a href="#locomotion-flying-around-on-a-broomstick.html"><strong aria-hidden="true">1.5.</strong> Locomotion</a></li><li class="chapter-item expanded "><a href="#interaction-casting-spells-to-recollect-your-knowledge.html"><strong aria-hidden="true">1.6.</strong> Interaction</a></li><li class="chapter-item expanded "><a href="#additional-changes-to-accomodate-the-setting.html"><strong aria-hidden="true">1.7.</strong> Additional changes</a></li><li class="chapter-item expanded "><a href="#evaluation.html"><strong aria-hidden="true">1.8.</strong> Evalutation</a></li><li class="chapter-item expanded "><a href="#what-i-learned.html"><strong aria-hidden="true">1.9.</strong> What I learned</a></li><li class="chapter-item expanded "><a href="#conclusion.html"><strong aria-hidden="true">1.10.</strong> Conclusion</a></li><li class="chapter-item expanded "><a href="#sources.html"><strong aria-hidden="true">1.11.</strong> Sources</a></li></ol></li><li class="chapter-item expanded "><a href="prop_hunt.html"><strong aria-hidden="true">2.</strong> Prop Hunt - Multiplayer using UE5</a></li><li class="chapter-item expanded "><a href="raytracing_ocean.html"><strong aria-hidden="true">3.</strong> Raytracing an ocean using WebGL2</a></li><li class="chapter-item expanded "><a href="discord_bot.html"><strong aria-hidden="true">4.</strong> Discord Bot using Rust and Serenity</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
