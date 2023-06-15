const sidebar = `
    <div class="side-bar">
        <header>
            <div class="image-text">
                <span class="image">
                    <img src="/assets/images/logo.png" alt="">
                </span>

                <div class="text header-text">
                    <span class="name">Admin</span>
                    <span class="email">admin@site.com</span>
                </div>
            </div>

            <i class="fa-solid fa-angle-right toggle"></i>
        </header>

        <div class="menu-bar">
            <div class="menu">
                <ul class="menu-links">

                    <li class="nav-name">
                        <span>Dashboard</span>
                    </li>

                    <li class="nav-link">
                        <a href="/dashboard" class="">
                            <i class="fa-solid fa-house icon"></i>
                            <span class="text nav-text">Dashboard</span>
                        </a>
                    </li>

                    <li class="nav-link">
                        <a href="/profile" class="">
                            <i class="fa-solid fa-house icon"></i>
                            <span class="text nav-text">Profile</span>
                        </a>
                    </li>
                    <li class="nav-link">
                        <a href="/company-add" class="">
                            <i class="fa-solid fa-house icon"></i>
                            <span class="text nav-text">Company Add</span>
                        </a>
                    </li>
                    <li class="nav-link">
                        <a href="/company-edit" class="">
                            <i class="fa-solid fa-house icon"></i>
                            <span class="text nav-text">Company Edit</span>
                        </a>
                    </li>
                    <li class="nav-link">
                        <a href="/product-add" class="">
                            <i class="fa-solid fa-house icon"></i>
                            <span class="text nav-text">Product Add</span>
                        </a>
                    </li>
                    <li class="nav-link">
                        <a href="/company-list" class="">
                            <i class="fa-solid fa-house icon"></i>
                            <span class="text nav-text">Company List</span>
                        </a>
                    </li>
                    <li class="nav-link">
                        <a href="/product-list" class="">
                            <i class="fa-solid fa-house icon"></i>
                            <span class="text nav-text">Product List</span>
                        </a>
                    </li>
                    <li class="nav-link">
                        <a href="/seller-add" class="">
                            <i class="fa-solid fa-house icon"></i>
                            <span class="text nav-text">Seller Add</span>
                        </a>
                    </li>
                    <li class="nav-link">
                        <a href="/seller-list" class="">
                            <i class="fa-solid fa-house icon"></i>
                            <span class="text nav-text">Seller List</span>
                        </a>
                    </li>
                </li>
                </ul>
            </div>
        </div>
    </div>`;

module.exports = {sidebar};