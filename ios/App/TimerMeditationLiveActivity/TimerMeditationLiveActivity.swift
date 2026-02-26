import ActivityKit
import WidgetKit
import SwiftUI

struct TimerMeditationAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var remainingTime: String
        var endTime: String
    }

    var name: String
}

@main
struct TimerMeditationLiveActivity: Widget {
    func dateFrom(isoString: String) -> Date {
        let formatter = ISO8601DateFormatter()
        return formatter.date(from: isoString) ?? Date()
    }

    var body: some WidgetConfiguration {
        ActivityConfiguration(for: TimerMeditationAttributes.self) { context in
            // Lock Screen UI
            VStack {
                HStack {
                    Image(systemName: "timer")
                        .foregroundColor(.orange)
                    Text(context.attributes.name)
                        .font(.headline)
                    Spacer()
                    Text(dateFrom(isoString: context.state.endTime), style: .timer)
                        .font(.title2)
                        .monospacedDigit()
                }
                .padding()
            }
            .activityBackgroundTint(Color.black.opacity(0.8))
            .activitySystemActionForegroundColor(Color.white)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI
                DynamicIslandExpandedRegion(.leading) {
                    Label("Meditation", systemImage: "timer")
                        .foregroundColor(.orange)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text(dateFrom(isoString: context.state.endTime), style: .timer)
                        .monospacedDigit()
                        .font(.title2)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Time remaining")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            } compactLeading: {
                Image(systemName: "timer")
                    .foregroundColor(.orange)
            } compactTrailing: {
                Text(dateFrom(isoString: context.state.endTime), style: .timer)
                    .monospacedDigit()
                    .frame(width: 45)
            } minimal: {
                Image(systemName: "timer")
                    .foregroundColor(.orange)
            }
            .widgetURL(URL(string: "breviarium://timer"))
            .keylineTint(Color.orange)
        }
    }
}
