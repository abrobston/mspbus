To build the Rhodes version (so far, for Android), you need to follow
the [installation instructions](http://docs.rhomobile.com/rhodes/install),
which for the most part on Linux is:

    $ [sudo] gem install rhodes
    $ [sudo] bundle
    $ rhodes-setup

Then, follow the
[Android build instructions](http://docs.rhomobile.com/rhodes/build#build-for-android).
It appears that JDK 1.6 is required and that 1.7 is not supported.

In order to get the Android SDK to work on Debian wheezy amd64,
I had to use the 32-bit version of the NDK.  Also, I had to do
the following:

    # dpkg --add-architecture i386
    # apt-get install ia32-libs lib32ncurses5 lib32stdc++6


