#include <cctype>
#include <iomanip>
#include <iostream>
#include <limits>
#include <string>
#include <vector>

using std::cin;
using std::cout;
using std::getline;
using std::string;
using std::vector;

class Diabetes {
private:
    string name_;
    double age_{};
    double weight_{};
    double height_{};
    char sex_{};
    double bmi_{};

    static char readChoice(const string& prompt, const string& allowed) {
        while (true) {
            cout << prompt;
            string input;
            cin >> input;
            if (!input.empty()) {
                char choice = static_cast<char>(std::toupper(static_cast<unsigned char>(input[0])));
                if (allowed.find(choice) != string::npos) {
                    return choice;
                }
            }
            cout << "Invalid input. Allowed choices: " << allowed << "\n";
        }
    }

    static bool askProceed(const string& prompt) {
        char ans = readChoice(prompt + " (Y/N): ", "YN");
        return ans == 'Y';
    }

    static double computeBMI(double weightKg, double heightCm) {
        if (heightCm <= 0) return 0.0;
        double heightM = heightCm / 100.0;
        return weightKg / (heightM * heightM);
    }

    static string bmiCategory(double bmi) {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25.0) return "Normal weight";
        if (bmi < 30.0) return "Overweight";
        return "Obese";
    }

public:
    void welcomeScreen() const {
        cout << "===============================================\n";
        cout << "            MEDICAL DIAGNOSIS SOFTWARE         \n";
        cout << "===============================================\n\n";
        cout << "Diabetes Analyzer (modernized console version)\n\n";
    }

    void getPersonalInfo() {
        cout << "Enter personal information:\n";
        cout << "Name: ";
        getline(cin >> std::ws, name_);

        cout << "Age: ";
        cin >> age_;
        cout << "Weight (kg): ";
        cin >> weight_;
        cout << "Height (cm): ";
        cin >> height_;
        sex_ = readChoice("Sex (M/F): ", "MF");

        bmi_ = computeBMI(weight_, height_);
        cout << "\nBMI: " << std::fixed << std::setprecision(1) << bmi_
             << " (" << bmiCategory(bmi_) << ")\n\n";
    }

    vector<char> getLevel1Symptoms() const {
        cout << "Level 1 symptoms\n";
        vector<char> s;
        s.push_back(readChoice("Appetite (H/L/N): ", "HLN"));
        s.push_back(readChoice("Frequency of thirst (H/L/N): ", "HLN"));
        s.push_back(readChoice("Frequency of urination (H/L/N): ", "HLN"));
        s.push_back(readChoice("Vision (I/N): ", "IN"));
        s.push_back(readChoice("Urine sugar (P/A): ", "PA"));
        s.push_back(readChoice("Ketonuria (P/A): ", "PA"));
        s.push_back(readChoice("Fasting blood sugar (H/L/N): ", "HLN"));
        s.push_back(readChoice("RBS (H/L/N): ", "HLN"));
        s.push_back(readChoice("Family history of diabetes (P/A): ", "PA"));
        s.push_back(readChoice("OGTT (D/N): ", "DN"));
        cout << "\n";
        return s;
    }

    vector<char> getLevel2Symptoms() const {
        cout << "Level 2 symptoms\n";
        vector<char> s;
        s.push_back(readChoice("Pancreatitis (P/A): ", "PA"));
        s.push_back(readChoice("Carcinoma (P/A): ", "PA"));
        s.push_back(readChoice("Cirrhosis (P/A): ", "PA"));
        s.push_back(readChoice("HCTS (H/L/N): ", "HLN"));
        s.push_back(readChoice("Hepatitis (P/A): ", "PA"));
        s.push_back(readChoice("Hormonal disorder (P/A): ", "PA"));
        s.push_back(readChoice("Pancreatectomy (P/A): ", "PA"));
        cout << "\n";
        return s;
    }

    vector<char> getLevel3Symptoms() const {
        cout << "Level 3 symptoms\n";
        vector<char> s;
        s.push_back(readChoice("Age group young/middle/elderly (Y/M/E): ", "YME"));
        s.push_back(readChoice("Body weight normal/above/below (N/A/B): ", "NAB"));
        s.push_back(readChoice("Duration weeks/months/years (W/M/Y): ", "WMY"));
        s.push_back(readChoice("Ketonuria (P/A): ", "PA"));
        s.push_back(readChoice("Auto antibodies (P/A): ", "PA"));
        cout << "\n";
        return s;
    }

    static int analyzeLevel1(const vector<char>& s) {
        if (s.size() != 10) {
            std::cerr << "Warning: analyzeLevel1 expected 10 symptoms, got " << s.size() << ".\n";
            return 0;
        }

        if (s[9] == 'D') {
            return -1;
        }
        if (s[5] == 'P' && s[6] == 'P' && s[7] == 'H') {
            return -1;
        }

        int count = 0;
        for (char c : s) {
            if (c == 'H' || c == 'P' || c == 'D' || c == 'I') {
                ++count;
            }
        }
        return (count > 5) ? -1 : 0;
    }

    static int analyzeLevel2(const vector<char>& s) {
        if (s.size() != 7) {
            std::cerr << "Warning: analyzeLevel2 expected 7 symptoms, got " << s.size() << ".\n";
            return 0;
        }

        const bool secondary =
            (s[0] == 'P') || (s[1] == 'P') || (s[2] == 'P') ||
            (s[3] == 'H') || (s[4] == 'P') || (s[5] == 'P') || (s[6] == 'P');
        return secondary ? -1 : 0;
    }

    static int analyzeLevel3(const vector<char>& s) {
        if (s.size() != 5) {
            std::cerr << "Warning: analyzeLevel3 expected 5 symptoms, got " << s.size() << ".\n";
            return -1;
        }

        // Insulin-dependent: ketonuria + auto-antibodies present, weight normal or below,
        // applicable to any age group (Y/M/E)
        const bool insulinDependent =
            (s[3] == 'P' && s[4] == 'P') &&
            (s[1] == 'N' || s[1] == 'B') &&
            (s[0] == 'Y' || s[0] == 'M' || s[0] == 'E');

        return insulinDependent ? 0 : -1;
    }

    bool displayLevel1Result(int result) const {
        if (result == 0) {
            cout << "Result: The person is NOT diabetic.\n";
            return false;
        }
        cout << "Result: The person is diabetic.\n";
        return askProceed("Proceed to level 2?");
    }

    bool displayLevel2Result(int result) const {
        if (result == 0) {
            cout << "Result: Primary diabetes.\n";
            return askProceed("Proceed to level 3?");
        }
        cout << "Result: Secondary diabetes.\n";
        return false;
    }

    void displayLevel3Result(int result) const {
        if (result == 0) {
            cout << "Result: Insulin-dependent diabetes.\n";
        } else {
            cout << "Result: Non-insulin-dependent diabetes.\n";
        }
    }
};

int main() {
    Diabetes app;
    app.welcomeScreen();
    app.getPersonalInfo();

    cout << "Starting diagnosis...\n\n";

    const vector<char> level1 = app.getLevel1Symptoms();
    const int result1 = Diabetes::analyzeLevel1(level1);
    if (!app.displayLevel1Result(result1)) {
        return 0;
    }

    const vector<char> level2 = app.getLevel2Symptoms();
    const int result2 = Diabetes::analyzeLevel2(level2);
    if (!app.displayLevel2Result(result2)) {
        return 0;
    }

    const vector<char> level3 = app.getLevel3Symptoms();
    const int result3 = Diabetes::analyzeLevel3(level3);
    app.displayLevel3Result(result3);
    return 0;
}
