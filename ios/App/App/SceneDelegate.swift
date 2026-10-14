import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    // Created by UIKit from the Main storyboard declared in Info.plist (UISceneStoryboardFile)
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        // On a cold start, URLs and universal links arrive here instead of in the AppDelegate.
        // Forward them on the next run loop, once the bridge and its plugins have been created.
        let urlContext = connectionOptions.urlContexts.first
        let userActivity = connectionOptions.userActivities.first
        DispatchQueue.main.async {
            if let urlContext {
                self.open(urlContext)
            }
            if let userActivity {
                self.continueActivity(userActivity)
            }
        }
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        URLContexts.forEach(open)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        continueActivity(userActivity)
    }

    // Keeps the App plugin's appUrlOpen event working, as the AppDelegate did before scenes
    private func open(_ context: UIOpenURLContext) {
        var options: [UIApplication.OpenURLOptionsKey: Any] = [.openInPlace: context.options.openInPlace]
        if let sourceApplication = context.options.sourceApplication {
            options[.sourceApplication] = sourceApplication
        }
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, open: context.url, options: options)
    }

    private func continueActivity(_ userActivity: NSUserActivity) {
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
    }
}
