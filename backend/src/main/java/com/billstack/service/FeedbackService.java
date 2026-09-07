package com.billstack.service;

import com.billstack.common.exception.ResourceNotFoundException;
import com.billstack.dto.CreateFeedbackRequest;
import com.billstack.dto.UserFeedbackDto;
import com.billstack.entity.UserFeedback;
import com.billstack.repository.UserFeedbackRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    private final UserFeedbackRepository feedbackRepository;

    public FeedbackService(UserFeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Transactional
    public UserFeedbackDto submitFeedback(String userId, CreateFeedbackRequest request) {
        UserFeedback feedback = new UserFeedback(
                userId,
                request.getFeedbackType() != null ? request.getFeedbackType() : "GENERAL",
                request.getFeatureArea(),
                request.getRating(),
                request.getMessage()
        );
        feedback = feedbackRepository.save(feedback);
        return UserFeedbackDto.fromEntity(feedback);
    }

    @Transactional(readOnly = true)
    public List<UserFeedbackDto> getUserFeedback(String userId) {
        return feedbackRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(UserFeedbackDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<UserFeedbackDto> getAllFeedback(int page, int size, String status) {
        Page<UserFeedback> pageRes = (status != null && !status.trim().isEmpty())
                ? feedbackRepository.findByStatusOrderByCreatedAtDesc(status, PageRequest.of(page, size))
                : feedbackRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return pageRes.map(UserFeedbackDto::fromEntity);
    }

    @Transactional
    public UserFeedbackDto updateFeedbackStatus(String feedbackId, String newStatus, String adminNotes) {
        UserFeedback fb = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("User feedback not found with id: " + feedbackId));
        fb.setStatus(newStatus);
        if (adminNotes != null) fb.setAdminNotes(adminNotes);
        if ("RESOLVED".equalsIgnoreCase(newStatus) || "CLOSED".equalsIgnoreCase(newStatus)) {
            fb.setResolvedAt(LocalDateTime.now());
        }
        fb = feedbackRepository.save(fb);
        return UserFeedbackDto.fromEntity(fb);
    }
}
