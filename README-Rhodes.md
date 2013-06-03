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

You may need to get revision 21 rather than revision 22 of the Android SDK
Tools to avoid certain build errors.  Go to your Android SDK directory and:

    $ wget https://dl-ssl.google.com/android/repository/tools_r21-linux.zip
    $ mv tools tools_r22
    $ unzip tools_r21-linux.zip
 
If you get a build error regarding `rm_f` in `android_tools.rb`, note
the location (on my system, it is
`/var/lib/gems/1.9.1/gems/rhodes-3.5.1.12/platform/android/build/android_tools.rb`),
go to the directory, and use the `android_tools.rb.diff` file in our `mspbus`
project to patch the code.

If you decide to target a recent version of Android, you may need
to symlink the `aapt` tool into the
platform-tools directory, along with some libraries:

    $ cd $ANDROID_SDK_HOME/platform-tools
    $ ln -s ../build-tools/android-4.2.2/aapt ./aapt
    $ ln -s ../build-tools/android-4.2.2/lib ./lib

Replace `$ANDROID_SDK_HOME` with the path to your Android SDK, and replace
the version number (4.2.2) with the latest version number in the directory.

