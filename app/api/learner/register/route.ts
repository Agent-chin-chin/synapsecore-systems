import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { registerUser } from '../../../../services/authService';
import { sendNotificationEmail, sendLearnerRegistrationPDF } from '../../../../lib/email';
import { sendSMS } from '@/lib/sms';
import Payment from '@/lib/models/Payment';
import Course from '@/lib/models/Course';

interface CourseDocument {
  _id: string;
  title: string;
  price?: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      learningGoal,
      country,
      state,
      termsConsent,
      dataProcessingConsent,
      selectedCourse,
      paymentPlanPreference,
    } = body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'Please complete all required fields.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    if (!termsConsent || !dataProcessingConsent) {
      return NextResponse.json(
        { message: 'Please accept the terms and privacy policy.' },
        { status: 400 }
      );
    }

    const fullname = `${firstName.trim()} ${lastName.trim()}`;

    const learnerProfile: Record<string, unknown> = {
      learningGoal,
      country: country || 'Nigeria',
      state,
      selectedCourse,
      paymentPlanPreference,
      dataProcessingConsent,
      termsConsent,
    };

    const result = await registerUser({
      fullname,
      email,
      phone,
      password,
      role: 'learner',
      status: 'pending',
      learnerProfile,
    });

    // Send registration PDF to admin email
    try {
      await sendLearnerRegistrationPDF({
        firstName,
        lastName,
        fullname,
        email,
        phone: phone || '',
        password,
        confirmPassword,
        dateOfBirth: '',
        gender: '',
        nationality: '',
        countryOfCitizenship: '',
        stateOfOrigin: '',
        identificationType: '',
        identificationNumber: '',
        idDocumentFront: '',
        idDocumentBack: '',
        idIssueDate: '',
        idExpiryDate: '',
        idIssuePlace: '',
        address: '',
        city: '',
        state: state || '',
        country: country || 'Nigeria',
        postalCode: '',
        timeZone: '',
        preferredLanguage: 'en',
        guardianName: '',
        guardianPhone: '',
        guardianEmail: '',
        guardianAddress: '',
        guardianRelationship: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactEmail: '',
        emergencyContactRelationship: '',
        secondaryEmergencyContactName: '',
        secondaryEmergencyContactPhone: '',
        secondaryEmergencyContactRelationship: '',
        educationLevel: '',
        employmentStatus: '',
        fieldOfStudy: '',
        institutionName: '',
        yearsOfExperience: '',
        previousCertifications: '',
        hearAboutUs: '',
        referralCode: '',
        selectedCourse,
        paymentPlanPreference,
        primaryDevice: '',
        operatingSystem: '',
        internetConnectivity: '',
        preferredLearningSchedule: '',
        backgroundCheckConsent: false,
        guardianConsent: false,
        dataProcessingConsent,
        marketingConsent: false,
        profilePicture: '',
      });
    } catch (emailError) {
      console.error('Failed to send registration PDF email:', emailError);
    }

    if (result.verificationCode) {
      const message = `Welcome ${result.user.fullname}! Your verification code is ${result.verificationCode}. Enter it on the verification page to confirm your account.`;

      try {
        await sendNotificationEmail(
          { email: result.user.email, fullname: result.user.fullname },
          'Verify your email',
          message
        );
      } catch (notifyError) {
        console.warn('Verification email failed to send:', notifyError);
      }

      if (result.user.phone) {
        try {
          await sendSMS(result.user.phone, message);
        } catch (smsError) {
          console.warn('SMS verification failed to send:', smsError);
        }
      }
    }

    let paymentInfo: { id: string; amount: number; status: string; course: string } | null = null;
    if (selectedCourse && paymentPlanPreference) {
      try {
        const course = await Course.findOne({ title: selectedCourse }).lean() as CourseDocument | null;
        if (course) {
          const coursePrice = typeof course.price === 'number' ? course.price : 0;
          const payment = new Payment({
            userId: result.user.id,
            amount: coursePrice,
            paymentMethod: 'paystack',
            transactionId: `PENDING-${result.user.id}-${Date.now()}`,
            paymentGateway: 'paystack',
            courseId: course._id,
            description: `Course payment: ${course.title}`,
          });
          await payment.save();
          paymentInfo = {
            id: payment._id.toString(),
            amount: payment.amount,
            status: payment.status,
            course: course.title,
          };
        }
      } catch (paymentError) {
        console.error('Failed to create payment record:', paymentError);
      }
    }

    const cookieStore = await cookies();
    cookieStore.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Learner account created successfully.',
        user: result.user,
        payment: paymentInfo,
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Error registering learner:', error);
    if (error instanceof Error && error.message === 'User with this email already exists') {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
