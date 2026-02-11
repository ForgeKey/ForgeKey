# Changelog

All notable changes to ForgeKey are documented in this file.

## [1.0.0-beta.5] - 2026-02-11

### Added

- add icon swap animation to private key copy button ([7013224](https://github.com/ForgeKey/ForgeKey/commit/70132246e40010857af0891ec34c115f6705636c))
- replace input focus ring with 1px gradient border ([6e1f48e](https://github.com/ForgeKey/ForgeKey/commit/6e1f48e7b996d53ab590f87634b49a43d7c01ad5))
- add eye icon toggle for password visibility on Input component ([ad1f842](https://github.com/ForgeKey/ForgeKey/commit/ad1f8422edf878b678e939c3a47d28d976cc52fd))
- add About item to tray menu with native macOS about panel ([b4deb6a](https://github.com/ForgeKey/ForgeKey/commit/b4deb6a69180c4168dc179685697632fdf2c16a3))

### Fixed

- remove default WebKit focus outline in Tauri WebView ([554b110](https://github.com/ForgeKey/ForgeKey/commit/554b110bfe3ec12a77ea507902f67ab3c7024587))
- sync Tauri packages to 2.10.x and pin time crate for rustc 1.85.0 ([db3c519](https://github.com/ForgeKey/ForgeKey/commit/db3c51989769b19a744d1cf12b41e7667e7d36b2))

## [1.0.0-beta.4] - 2026-02-09

### Fixed

- redirect to welcome screen when last keystore address is deleted ([ec68f45](https://github.com/ForgeKey/ForgeKey/commit/ec68f454f4ffc28040ab6a2c389c8eec0c505735))
- back button on keystore view always returns to main page ([32ce73c](https://github.com/ForgeKey/ForgeKey/commit/32ce73c42dc09072933b3c100f0f387e7897b68e))
- add missing Tauri v2 capability permissions for auto-updater ([438e799](https://github.com/ForgeKey/ForgeKey/commit/438e7992903332afdf63f83f6f6bd09dbdec006f))

## [1.0.0-beta.3] - 2026-02-07

### Changed

- move welcome screen button to fixed footer ([5386fda](https://github.com/ForgeKey/ForgeKey/commit/5386fda18309d26c8b1dfd14326add222f34646d))

### Fixed

- use full semver version in install script filenames ([f3422cf](https://github.com/ForgeKey/ForgeKey/commit/f3422cfff10a55956266cd570f73fdff86c827fd))
- remove min-height constraint to prevent unnecessary scroll ([d9d4cc1](https://github.com/ForgeKey/ForgeKey/commit/d9d4cc19aaa1e0e9acc924c741bbeaf2d4806bd2))

## [1.0.0-beta.2] - 2026-02-07

### Changed

- centralize spacing constants in layout components ([b2b8f5c](https://github.com/ForgeKey/ForgeKey/commit/b2b8f5c08ca0540b352490a985aa19e62be42192))
- use AnimatedPage and spacing constants across all screens ([6c170f0](https://github.com/ForgeKey/ForgeKey/commit/6c170f0712e413833293c6ddb47f401058089b1f))
- update button gradient colors with custom purple-fuchsia gradients ([d447747](https://github.com/ForgeKey/ForgeKey/commit/d44774787fb96d85931ef77ff23a87ea72874835))
- move form submit buttons to fixed footer via HTML form attribute ([dc8c773](https://github.com/ForgeKey/ForgeKey/commit/dc8c7732cfc0895a9535e290639bbc7a266ebfb0))

### Documentation

- update release workflow with Linux support and auto-updater details ([7739457](https://github.com/ForgeKey/ForgeKey/commit/7739457b28eb0be2d040654ca27a1a2a1b76e72e))

### Fixed

- correct download URLs and add native Linux package support ([cdc6b46](https://github.com/ForgeKey/ForgeKey/commit/cdc6b469b8f3cb4277886902d017d834472c02a7))
- remove double padding on Create Workspace screen ([ef869f5](https://github.com/ForgeKey/ForgeKey/commit/ef869f5a21c503ab54bbe33b836d9f1f5fdfa15c))
- use consistent p-3 padding in KeystoreView ([47480a7](https://github.com/ForgeKey/ForgeKey/commit/47480a7cd2aac476a9ff34fe17cb18c2d80ba203))
- prevent header shift during page transitions ([0d7435c](https://github.com/ForgeKey/ForgeKey/commit/0d7435c0caba0afaa3af0437f7226b3c12792810))
- use realistic vanity address placeholder examples ([d387449](https://github.com/ForgeKey/ForgeKey/commit/d387449101bcfa5dd67b3ad42e77f69191c055c8))
- address list gap ([3d6905a](https://github.com/ForgeKey/ForgeKey/commit/3d6905ae4bc88cc44c11588acaadace24673dd9a))

### Miscellaneous

- update app icons ([577540b](https://github.com/ForgeKey/ForgeKey/commit/577540b1a223f89133f6e435098b09d29c2f509d))

## [1.0.0-beta.1] - 2026-01-26

### Added

- glassmorphism design ([46f7053](https://github.com/ForgeKey/ForgeKey/commit/46f7053a0101d3d758026ff5aaff153b61620553))
- add client-side router with zustand store ([70b693c](https://github.com/ForgeKey/ForgeKey/commit/70b693cf438b9be4277fa5dde7288b63dea10f86))
- add Zustand store for wallet state management ([aafd81f](https://github.com/ForgeKey/ForgeKey/commit/aafd81f6b7a45ab9c0b11431f43935b31db59b20))
- add welcome and empty keystore onboarding screens ([8d3959d](https://github.com/ForgeKey/ForgeKey/commit/8d3959ddfe096cb21f2fc2e9644e7c5e61bbf13d))
- add onboarding and import-options routes ([f68c2a9](https://github.com/ForgeKey/ForgeKey/commit/f68c2a9f3e95bb706b2b31ed97702a33683d4662))
- auto-navigate to onboarding when no keystores exist ([326c6ee](https://github.com/ForgeKey/ForgeKey/commit/326c6ee616aa3199d1e21d3a722190dd010671de))
- add centralized animation variants for page transitions ([d5a9626](https://github.com/ForgeKey/ForgeKey/commit/d5a9626b6f11700f56a1496239a40a61dc197b1c))
- add reusable animated UI components ([503cb7e](https://github.com/ForgeKey/ForgeKey/commit/503cb7ea9c4a4b5dfc858058d14265a2a509ec28))
- add animated page transitions to router ([11a1f2d](https://github.com/ForgeKey/ForgeKey/commit/11a1f2dacf3a9c83dfe29663d1aa0a9c5dc1cb7a))
- add fullscreen overlay support using tauri-nspanel ([9f970ed](https://github.com/ForgeKey/ForgeKey/commit/9f970ed7fffc06c9b67377b791607af30f4a5621))
- add Linux platform support with system tray ([289908a](https://github.com/ForgeKey/ForgeKey/commit/289908a7cbfe0e6384ffe272554a550eeecc92ba))
- add auto-updater with in-app update notifications ([787a5ed](https://github.com/ForgeKey/ForgeKey/commit/787a5ed32e173f488fcc41bd54dd038b4d193aa5))
- add curl install script and Linux release targets ([b1ab311](https://github.com/ForgeKey/ForgeKey/commit/b1ab311ea65e11e84bd4794e626af873ea6f0af7))
- use PTY for password input to avoid exposing secrets in process list ([75da550](https://github.com/ForgeKey/ForgeKey/commit/75da55060d10e5c98c11bbf9ec7bc94f9c6a8362))

### Changed

- reorganize hooks into domain-specific directories ([c8e2bf4](https://github.com/ForgeKey/ForgeKey/commit/c8e2bf40b5a68eca74b345a41747f1c67861788c))
- migrate footer to use router navigation ([2bbd408](https://github.com/ForgeKey/ForgeKey/commit/2bbd4086e444e0ac1335ada5eb1a89ed60abf187))
- add margin to address form submit buttons ([48e8c0f](https://github.com/ForgeKey/ForgeKey/commit/48e8c0f1e5a2353f25719b1028f4f892ff59fb03))
- update keystore context import paths ([e55ca91](https://github.com/ForgeKey/ForgeKey/commit/e55ca91ac31d091957b49d4287260c98c2eadf7f))
- migrate main page to route-based architecture ([a0288ff](https://github.com/ForgeKey/ForgeKey/commit/a0288ffccd5f7a05a05b7d56297072e0603bcac7))
- split address management into individual hooks ([82d3b65](https://github.com/ForgeKey/ForgeKey/commit/82d3b6595ce8c20c9bdccb5b4f999d14c7d2751e))
- remove aggregator address management hook ([eec7f07](https://github.com/ForgeKey/ForgeKey/commit/eec7f079081efd051beab9331c268231fca83472))
- migrate to individual address management hooks ([f16d17f](https://github.com/ForgeKey/ForgeKey/commit/f16d17f3767063495a51a43c9409a958c5fd2086))
- migrate wallet hooks to Zustand store ([27c7b86](https://github.com/ForgeKey/ForgeKey/commit/27c7b86b865eedb7351e51fb0978cdad26f56f27))
- migrate router hooks to Zustand store ([33f58db](https://github.com/ForgeKey/ForgeKey/commit/33f58db615c71319e24b8376ab1bc1a8878dae96))
- migrate address hooks to Zustand store ([160b0ff](https://github.com/ForgeKey/ForgeKey/commit/160b0ff7e60528e4805bdaa391d6dc54bc3360ec))
- migrate main page to use Zustand store selectors ([dca6b90](https://github.com/ForgeKey/ForgeKey/commit/dca6b90a4ecace79720c4de3e759b5af6c7d1b72))
- remove KeystoreProvider in favor of Zustand ([7d5ccc7](https://github.com/ForgeKey/ForgeKey/commit/7d5ccc7433f8cd249b558fe357e9a31bf649bf75))
- reduce app window size to 350x400 ([486c235](https://github.com/ForgeKey/ForgeKey/commit/486c235a9b7c763367883751214c82f6f5d789ea))
- replace import dialog with inline import options screen ([6494da6](https://github.com/ForgeKey/ForgeKey/commit/6494da6a64afcd278d14b564b80bf6a461ea947f))
- update UI components with refined styling ([9996cdc](https://github.com/ForgeKey/ForgeKey/commit/9996cdc05138cc70bd418fa2be9c2d588697ada5))
- refine address form components with consistent layout ([acc5edb](https://github.com/ForgeKey/ForgeKey/commit/acc5edb928303be9c1f8fc1bea9e60f95cbd5b36))
- refine core components with updated layout and styling ([4ad8981](https://github.com/ForgeKey/ForgeKey/commit/4ad8981e99894c8fa297259a1f7082bcc8e935e7))
- improve password zeroization comments ([efc59a7](https://github.com/ForgeKey/ForgeKey/commit/efc59a7b085ddc164ce0d7e696f8e5f9b2e5daba))
- integrate new onboarding flow and import options ([ae051e1](https://github.com/ForgeKey/ForgeKey/commit/ae051e1a62dd07a23f897b0a66ffe86c42c51f04))
- update dark theme colors and border radius tokens ([f94a87a](https://github.com/ForgeKey/ForgeKey/commit/f94a87af4e11f0b55c038c2bd83035aff1582e89))
- refactor core components with updated layout and styling ([080f5bd](https://github.com/ForgeKey/ForgeKey/commit/080f5bd6fd696e0f6ebc0d5e582be2da93f2558a))
- migrate Tailwind CSS to v4 with CSS-based theme config ([b9e8880](https://github.com/ForgeKey/ForgeKey/commit/b9e8880429c8c69d94eb87d4f1d37a6f858e0d33))
- migrate ESLint to v9 flat config format ([0f5d1ae](https://github.com/ForgeKey/ForgeKey/commit/0f5d1aebf2afbc597a4ad4fbfc7fb1887c39785d))
- update Next.js config for Turbopack bundler ([2e484f8](https://github.com/ForgeKey/ForgeKey/commit/2e484f818c87ef980399efb0e8f35b020974d01a))
- replace useEffect+setState with useMemo for derived state ([e133561](https://github.com/ForgeKey/ForgeKey/commit/e133561f9d148634df91fa30b23cee01e80631d5))
- add dark/default variants to Input component ([ab38710](https://github.com/ForgeKey/ForgeKey/commit/ab3871092002e1736ff109dce52a7103a7450500))
- add motion animations to password strength indicator ([aca3e90](https://github.com/ForgeKey/ForgeKey/commit/aca3e903fbc421e957f7ac9a438db72edfdd7a48))
- simplify dialog background styling ([ad818fc](https://github.com/ForgeKey/ForgeKey/commit/ad818fc45c2e0e1c89883c24547df09f69b7845d))
- migrate core components to use animated layout components ([f40b788](https://github.com/ForgeKey/ForgeKey/commit/f40b78868de4412972d84ce47d04a68adb348549))
- update footer layout and delete dialog button styling ([17e806e](https://github.com/ForgeKey/ForgeKey/commit/17e806ef8059f705e2463199b971dfa55b2d43dd))
- simplify password dialog and use Input dark variant ([e6b5e72](https://github.com/ForgeKey/ForgeKey/commit/e6b5e723ad53fd7ab71978ea73e48794a44b834d))
- migrate from CVA to Tailwind Variants with slots support ([273b4d5](https://github.com/ForgeKey/ForgeKey/commit/273b4d5f7cf7fe097903705183d47508e8ec923a))
- extract reusable FormField, DialogIconBadge, and AddressDisplay components ([0daade5](https://github.com/ForgeKey/ForgeKey/commit/0daade56f0f0c6c54f4c19523628a31e33d03f04))
- use PTY for password input in get_wallet_address ([2d2a0d3](https://github.com/ForgeKey/ForgeKey/commit/2d2a0d35cc48b6f5960335ef153a102fa64e4bfd))

### Fixed

- adjust styles ([380da39](https://github.com/ForgeKey/ForgeKey/commit/380da39c82bbf1781fb7d33cc160696397a237c5))
- use --password flag for cast wallet address command ([2f65f29](https://github.com/ForgeKey/ForgeKey/commit/2f65f29bf6cf1d05dff10fb94045164569b57b74))
- zeroize passwords and private keys immediately when no longer needed ([3283efc](https://github.com/ForgeKey/ForgeKey/commit/3283efc8cced72ca4a5c88f007cc16255409a7b9))
- close panel when clicking outside by handling window_did_resign_key event ([a43c754](https://github.com/ForgeKey/ForgeKey/commit/a43c754ad1d73b7fd35b823db3c2706de2df6dd7))
- resolve Linux CI package conflict by removing duplicate libappindicator3-dev ([567d06c](https://github.com/ForgeKey/ForgeKey/commit/567d06ca615b1fd75af6064a8a3004695ab4e0d4))
- remove macos-private-api from global tauri features for Linux compatibility ([70eab1b](https://github.com/ForgeKey/ForgeKey/commit/70eab1b17154abce651acd38a43e55f2b6af3b1d))
- use platform-specific tauri deps for Linux CI compatibility ([9e80019](https://github.com/ForgeKey/ForgeKey/commit/9e8001939f2ddc866ec99693f3b1d139dd9ddbb0))
- use tauri build CLI for cross-platform CI builds ([b1d95e2](https://github.com/ForgeKey/ForgeKey/commit/b1d95e2c37057e549faeeeea6fff7f4aaeb56299))
- disable updater artifact signing in CI builds ([63acdda](https://github.com/ForgeKey/ForgeKey/commit/63acdda573b6b67647adbad9fa16fd936da398ae))
- correct repository URL references ([3bf25c9](https://github.com/ForgeKey/ForgeKey/commit/3bf25c9bf418d96d0cc04f8151c92199e7508d8b))

### Miscellaneous

- remove theme context and toggle component ([75d86b4](https://github.com/ForgeKey/ForgeKey/commit/75d86b4ebfb1a14f58034baa3e833ec45f0a61cf))
- add zustand for state management ([d9a23bb](https://github.com/ForgeKey/ForgeKey/commit/d9a23bb04c6441b7170021f62f75feaff3f49e1c))
- add immer dependency for Zustand mutations ([bf5f34b](https://github.com/ForgeKey/ForgeKey/commit/bf5f34bccb149ed788468d8d0c2b3072e2300233))
- remove deprecated context and state management files ([061c638](https://github.com/ForgeKey/ForgeKey/commit/061c6384f15432ecd59a2b13df8970ff6edbe21a))
- update dependencies to the latest versions ([e9c3ea1](https://github.com/ForgeKey/ForgeKey/commit/e9c3ea13b6b2d887758a8e671d5863dd9676451f))
- upgrade all dependencies to latest versions ([6ebbcd7](https://github.com/ForgeKey/ForgeKey/commit/6ebbcd7d24832801f4ee74005bcc5c07685e493d))
- add motion library for animations ([ad333aa](https://github.com/ForgeKey/ForgeKey/commit/ad333aa1c7fa385dc7f1fabde51730d21ab56108))


